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
import AssignMaterialDialog from 'client/dialogs/cards-assign-dialog';

// svg
import ContentAdd from 'material-ui/svg-icons/content/add';
import SVGCards from 'material-ui/svg-icons/action/perm-device-information';
import FilterBar from 'lib/ui/components/filter-bar';

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
                <Paper>
                    <FilterBar
                        filter={this.state.search_text}
                        set_filter={filter =>
                            this.setState({ search_text: filter })
                        }
                    />
                </Paper>
                <Paper>
                    <Tags.TagsFilterContainer />
                </Paper>
                <Paper
                    zDepth={5}
                    style={{ maxWidth: '820px', margin: '20px auto' }}
                >
                    <List>
                        {this.props.cards
                            .filter(card => {
                                return this.state.search_text === ''
                                    ? true
                                    : (card.name + card.description)
                                          .toLocaleLowerCase()
                                          .indexOf(
                                              this.state.search_text.toLocaleLowerCase()
                                          ) > -1;
                            })
                            .sort(Core.utils.alphabetically)
                            .map(card => (
                                <ListItem
                                    style={{
                                        backgroundColor:
                                            this.props.selected_cards.indexOf(
                                                card._id
                                            ) > -1
                                                ? UI.config.primary_color
                                                : 'white'
                                    }}
                                    leftAvatar={
                                        <Avatar>
                                            {_card_type(card.card_type)}
                                        </Avatar>
                                    }
                                    primaryText={card.name}
                                    secondaryText={
                                        <Tags.TagsContainer
                                            tag_ids={card.tags}
                                        />
                                    }
                                    onClick={() => {
                                        this.props.dispatch(
                                            Cards.actions.change_card(card)
                                        );
                                        this.props.dispatch(
                                            UI.actions.push(
                                                '/admin/cards/' + card._id
                                            )
                                        );
                                    }}
                                />
                            ))}
                    </List>
                </Paper>

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
                <AssignMaterialDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        cards: Cards.selectors.with_tags(state, state.tags.ui.selected_tags),
        card: state.cards.ui.card,
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
