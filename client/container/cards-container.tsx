// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { intersection } from 'lodash';

// components
import { Avatar, List, ListItem, IconButton } from 'material-ui';
import FilterBar from 'lib/ui/components/filter-bar';

import SVGRightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import SVGRemove from 'material-ui/svg-icons/navigation/close';

// local
import { IState } from 'client/state';

// modules
import * as Cards from 'lib/cards';
import * as Tags from 'lib/tags';

import { _card_type } from 'lib/cards/components/card-type';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    card_ids: string[];
    cards: Cards.ICard[];
    selected_card_ids: string[];
    selected_cards: Cards.ICard[];
    selected_tags: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
}

export class CardsContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(Cards.actions.get_cards());
    }

    public render() {
        return (
            <div
                style={{
                    display: 'flex'
                }}
            >
                <div
                    style={{
                        width: '50%'
                    }}
                >
                    Material suchen
                    <FilterBar
                        filter={this.state.search_text}
                        set_filter={filter =>
                            this.setState({ search_text: filter })
                        }
                    />
                    <List>
                        {this.props.cards
                            .filter(
                                card =>
                                    card.name.indexOf(this.state.search_text) >
                                    -1
                            )
                            .filter(
                                card =>
                                    this.props.selected_card_ids.indexOf(
                                        card._id
                                    ) === -1
                            )
                            .filter(
                                card =>
                                    intersection(
                                        card.tags,
                                        this.props.selected_tags
                                    ).length === this.props.selected_tags.length
                            )
                            .map(card => (
                                <ListItem
                                    key={card._id}
                                    primaryText={card.name}
                                    secondaryText={
                                        <Tags.TagsContainer
                                            tag_ids={card.tags}
                                        />
                                    }
                                    onClick={() =>
                                        this.props.dispatch(
                                            Cards.actions.select_card(card._id)
                                        )
                                    }
                                    leftAvatar={
                                        <Avatar>
                                            {_card_type(card.card_type)}
                                        </Avatar>
                                    }
                                    rightIconButton={
                                        <IconButton
                                            onClick={() =>
                                                this.props.dispatch(
                                                    Cards.actions.select_card(
                                                        card._id
                                                    )
                                                )
                                            }
                                        >
                                            <SVGRightArrow />
                                        </IconButton>
                                    }
                                />
                            ))}
                    </List>
                </div>
                <div style={{ width: '50%' }}>
                    Material zuweisen
                    <List>
                        {this.props.selected_cards.map(card => (
                            <ListItem
                                key={card._id}
                                primaryText={card.name}
                                secondaryText={
                                    <Tags.TagsContainer tag_ids={card.tags} />
                                }
                                onClick={() =>
                                    this.props.dispatch(
                                        Cards.actions.select_card(card._id)
                                    )
                                }
                                leftAvatar={
                                    <Avatar>
                                        {_card_type(card.card_type)}
                                    </Avatar>
                                }
                                rightIconButton={
                                    <IconButton
                                        onClick={() =>
                                            this.props.dispatch(
                                                Cards.actions.select_card(
                                                    card._id
                                                )
                                            )
                                        }
                                    >
                                        <SVGRemove />
                                    </IconButton>
                                }
                            />
                        ))}
                    </List>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_ids: state.cards.ui.selected_cards,
        selected_card_ids: state.cards.ui.selected_cards,
        selected_cards: Cards.selectors.select_cards_by_ids(
            state,
            state.cards.ui.selected_cards
        ),
        cards: state.cards.list,
        selected_tags: state.tags.ui.selected_tags
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(CardsContainer);
