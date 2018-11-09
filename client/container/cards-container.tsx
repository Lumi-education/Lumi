// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { intersection } from 'lodash';

// components
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { CardList } from 'client/components';
import { TagsChipInputContainer } from 'client/container';

import SVGRightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import SVGRemove from 'material-ui/svg-icons/navigation/close';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
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
    search_text: string;
    tag_ids: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class CardsContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
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
                    <Typography variant="h5" component="h3">
                        {Core.i18n.t('search_for.cards')}
                    </Typography>
                    <TextField
                        id="standard-name"
                        label={Core.i18n.t('search')}
                        value={this.props.search_text}
                        onChange={e =>
                            this.props.dispatch(
                                UI.actions.set_search_filter(e.target.value)
                            )
                        }
                        margin="normal"
                        fullWidth={true}
                    />
                    <TagsChipInputContainer
                        tag_ids={this.props.tag_ids}
                        onChange={tag_ids =>
                            this.props.dispatch(
                                Tags.actions.set_selected_tags(tag_ids)
                            )
                        }
                    />
                    <CardList
                        cards={this.props.cards
                            .filter(
                                card =>
                                    card.name.indexOf(this.props.search_text) >
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
                            .slice(0, 4)}
                        onListItemClick={(card_id: string) =>
                            this.props.dispatch(
                                Cards.actions.select_card(card_id)
                            )
                        }
                    />
                </div>
                <div style={{ width: '50%' }}>
                    {Core.i18n.t('assign.cards')}
                    <CardList
                        cards={this.props.selected_cards}
                        onListItemClick={(card_id: string) =>
                            this.props.dispatch(
                                Cards.actions.select_card(card_id)
                            )
                        }
                    />
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
        selected_tags: state.tags.ui.selected_tags,
        search_text: state.ui.search_filter_text,
        tag_ids: state.tags.ui.selected_tags
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
