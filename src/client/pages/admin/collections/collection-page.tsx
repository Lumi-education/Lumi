// modules
import * as React from 'react';
import { connect } from 'react-redux';

// components
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import { AddButtonComponent } from 'lib/ui';
import CardsDialog from '../cards/cards-dialog';
import {
    CollectionCardsContainer,
    CollectionSettingsContainer
} from 'lib/collections';
// local
import { IState } from 'client/state';

// types
import { ICollection } from 'lib/collections/types';

// selectors
import { select_collection_by_id } from 'lib/collections/selectors';
// actions
import { get_collection } from 'lib/collections/actions';
import { toggle_cards_dialog, push } from 'lib/ui/actions';

interface IStateProps {
    collection_id: string;
    tab: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminCollectionPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Tabs
                    style={{
                        position: 'fixed',
                        backgroundColor: '#FFFFFF',
                        top: '64px',
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
                                    <CollectionSettingsContainer
                                        collection_id={this.props.collection_id}
                                    />
                                );
                            case 'cards':
                                return (
                                    <div>
                                        <CollectionCardsContainer
                                            collection_id={
                                                this.props.collection_id
                                            }
                                        />
                                        <AddButtonComponent
                                            action={() =>
                                                this.props.dispatch(
                                                    toggle_cards_dialog()
                                                )
                                            }
                                        />
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
        tab: ownProps.params.tab
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
