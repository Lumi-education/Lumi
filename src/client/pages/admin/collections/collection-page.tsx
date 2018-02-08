// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Tabs, Tab, Paper, FloatingActionButton } from 'material-ui';
import { AddButtonComponent, ActionBar } from 'lib/ui';
import CardsDialog from '../cards/cards-dialog';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

// state
import { IState } from 'client/state';

// modules
import * as Cards from 'lib/cards';
import * as Collections from 'lib/collections';

import CardListContainer from 'lib/cards/container/card-list';

// selectors
import { select_collection_by_id } from 'lib/collections/selectors';
// actions
import { get_collection } from 'lib/collections/actions';
import { toggle_cards_dialog, push } from 'lib/ui/actions';

const log = debug('lumi:client:admin:collections:collection-page');

interface IStateProps {
    collection_id: string;
    tab: string;
    collection: Collections.ICollection;
    selected_cards: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminCollectionPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(
            Collections.actions.get_collection(this.props.collection_id)
        );
    }

    public render() {
        if (!this.props.collection._id) {
            return <div>loading</div>;
        }
        return (
            <div>
                <Tabs
                    style={{
                        backgroundColor: '#FFFFFF',
                        zIndex: 1099,
                        width: '100%'
                    }}
                    tabItemContainerStyle={{
                        background: 'linear-gradient(120deg, #8e44ad, #3498db)'
                    }}
                    value={this.props.tab}
                >
                    <Tab
                        label="Settings"
                        value="settings"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/collections/' +
                                        this.props.collection_id +
                                        '/settings'
                                )
                            )
                        }
                    />
                    <Tab
                        label="Cards"
                        value="cards"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/collections/' +
                                        this.props.collection_id +
                                        '/cards'
                                )
                            )
                        }
                    />
                </Tabs>
                <Paper>
                    {(() => {
                        switch (this.props.tab) {
                            case 'settings':
                            default:
                                return (
                                    <Collections.CollectionSettingsContainer
                                        collection_id={this.props.collection_id}
                                    />
                                );
                            case 'cards':
                                return (
                                    <div>
                                        <CardListContainer
                                            onClick={card_id =>
                                                this.props.dispatch(
                                                    Cards.actions.select_card(
                                                        card_id
                                                    )
                                                )
                                            }
                                            card_ids={
                                                this.props.collection.cards
                                            }
                                        />
                                        <ActionBar>
                                            {this.props.selected_cards.length >
                                            0 ? (
                                                <FloatingActionButton
                                                    secondary={true}
                                                    onClick={() => {
                                                        this.props
                                                            .dispatch(
                                                                Collections.actions.rem_cards_to_collection(
                                                                    this.props
                                                                        .collection_id,
                                                                    this.props
                                                                        .selected_cards
                                                                )
                                                            )
                                                            .then(res =>
                                                                this.props.dispatch(
                                                                    Cards.actions.reset_card_selection()
                                                                )
                                                            );
                                                    }}
                                                >
                                                    <ContentRemove />
                                                </FloatingActionButton>
                                            ) : null}

                                            <FloatingActionButton
                                                onClick={() =>
                                                    this.props.dispatch(
                                                        toggle_cards_dialog()
                                                    )
                                                }
                                            >
                                                <ContentAdd />
                                            </FloatingActionButton>
                                        </ActionBar>
                                        <CardsDialog
                                            collection_id={
                                                this.props.collection_id
                                            }
                                        />
                                    </div>
                                );
                        }
                    })()}
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_id: ownProps.params.collection_id,
        collection: Collections.selectors.select_collection_by_id(
            state,
            ownProps.params.collection_id
        ),
        tab: ownProps.params.tab,
        selected_cards: state.cards.ui.selected_cards
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        push: (url: string) => dispatch(push(url))
    };
}

export default connect<{}, {}, { collection_id: string }>(
    mapStateToProps,
    mapDispatchToProps
)(AdminCollectionPage);
