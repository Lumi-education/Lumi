// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as debug from 'debug';

import { FloatingActionButton, Paper } from 'material-ui';

// svg
import ContentAdd from 'material-ui/svg-icons/content/add';
import SVGCards from 'material-ui/svg-icons/action/perm-device-information';

import TagFilterContainer from 'lib/tags/container/tag-filter';
import FilterBar from 'lib/ui/components/filter-bar';

// local
import { IState } from 'client/state';

// selectors
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Tags from 'lib/tags';

// components
import CreateCardDialog from '../dialogs/create-card';
import AssignMaterialDialog from '../dialogs/assign_material';

const log = debug('lumi:modules:admin:cards:cards-page');

interface IStateProps {
    cards: Cards.ICard[];
    selected_cards: string[];
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
        this.setState({ loading: 'Karten', loading_step: 1 });
        this.props.dispatch(Cards.actions.get_cards()).then(res => {
            this.setState({ loading: 'Tags', loading_step: 2 });
            this.props.dispatch(Tags.actions.get_tags()).then(tags_res => {
                this.setState({ loading: 'finished', loading_step: 3 });
            });
        });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={0}
                    max={3}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }
        return (
            <div style={{}}>
                {/* <TagFilterContainer /> */}
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })
                    }
                />
                <Paper>
                    <Tags.TagsFilterContainer />
                </Paper>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}
                >
                    {this.props.cards
                        .sort(Core.utils.alphabetically)
                        .map(card => (
                            <Cards.components.Card
                                key={card._id}
                                onClick={() =>
                                    this.props.dispatch(
                                        Cards.actions.select_card(card._id)
                                    )
                                }
                                selected={
                                    this.props.selected_cards.indexOf(
                                        card._id
                                    ) > -1
                                }
                                card={card}
                                edit={event => {
                                    event.preventDefault();
                                    this.props.dispatch(
                                        Cards.actions.change_card(card)
                                    );
                                    this.props.dispatch(
                                        UI.actions.toggle_create_card_dialog()
                                    );
                                }}
                            />
                        ))}
                </div>

                <UI.components.ActionBar>
                    {this.props.selected_cards.length !== 0 ? (
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
                    ) : null}
                    <FloatingActionButton
                        onClick={() => {
                            this.props.dispatch(Cards.actions.reset_card()); // this is neededd, because the _id is used to determine if a card should be edited or created.
                            this.props.dispatch(
                                UI.actions.toggle_create_card_dialog()
                            );
                        }}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </UI.components.ActionBar>
                <AssignMaterialDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        cards: Cards.selectors.with_tags(state, state.tags.ui.selected_tags),
        selected_cards: state.cards.ui.selected_cards
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
