// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import {
    Avatar,
    List,
    ListItem,
    FloatingActionButton,
    Paper
} from 'material-ui';

import { Card } from 'client/components';
import { TagsChipInputContainer } from 'client/container';

// svg
import ContentAdd from 'material-ui/svg-icons/content/add';
import SVGCards from 'material-ui/svg-icons/action/perm-device-information';
import SVGFolder from 'material-ui/svg-icons/file/folder';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Tags from 'lib/tags';
import { _card_type } from 'lib/cards/components/card-type';

const log = debug('lumi:modules:admin:cards:cards-page');

interface IStateProps {
    cards: Cards.ICard[];
    selected_cards: string[];
    card: Cards.ICard;

    search_text: string;
    selected_tags: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    filter?: string[];
    search_text?: string;
    new_tag_name?: string;
    new_tag_description?: string;
    loading?: string;
    loading_step?: number;
}

export class AdminCards extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            filter: [],
            search_text: '',
            new_tag_name: '',
            new_tag_description: '',
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: Core.i18n.t('cards'), loading_step: 1 });
        this.props.dispatch(Cards.actions.get_cards()).then(res => {
            this.setState({ loading: 'finished', loading_step: 2 });
        });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={0}
                    max={2}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }
        return (
            <div>
                <Paper>
                    <TagsChipInputContainer
                        tag_ids={this.props.selected_tags}
                        onChange={(tag_ids: string[]) =>
                            this.props.dispatch(
                                Tags.actions.set_selected_tags(tag_ids)
                            )
                        }
                    />
                </Paper>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                    }}
                >
                    {this.props.cards
                        .filter(
                            card =>
                                card.name.indexOf(this.props.search_text) > -1
                        )
                        .slice(0, 20)
                        .map(card => (
                            <Card
                                key={card._id}
                                card={card}
                                selected={
                                    this.props.selected_cards.indexOf(
                                        card._id
                                    ) > -1
                                }
                                select={() =>
                                    this.props.dispatch(
                                        Cards.actions.select_card(card._id)
                                    )
                                }
                                view={() =>
                                    this.props.dispatch(
                                        UI.actions.push(
                                            '/admin/cards/' + card._id
                                        )
                                    )
                                }
                            />
                        ))}
                </div>

                <UI.components.ActionBar>
                    {/* {this.props.selected_cards.length !== 0 ? (
                        <div>
                            <FloatingActionButton
                                onClick={() => {
                                    this.props.dispatch(
                                        UI.actions.toggle_assign_material_dialog()
                                    );
                                }}
                                style={{
                                    zIndex: 5000
                                }}
                            >
                                <SVGCards />
                            </FloatingActionButton>
                        </div>
                    ) : null} */}
                    <FloatingActionButton
                        onClick={() => {
                            this.props
                                .dispatch(Cards.actions.create_card())
                                .then(res => {
                                    this.props.dispatch(
                                        UI.actions.push(
                                            '/admin/cards/' + res.payload._id
                                        )
                                    );
                                });
                        }}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </UI.components.ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        cards: Cards.selectors.with_tags(state, state.tags.ui.selected_tags),
        selected_tags: state.tags.ui.selected_tags,
        card: state.cards.ui.card,
        selected_cards: state.cards.ui.selected_cards,
        search_text: state.ui.search_filter_text
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminCards);
