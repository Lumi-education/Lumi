// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { assign, noop } from 'lodash';

// components
import MultiplechoiceCardComponent from 'client/packages/cards/components/multiplechoice';
import FreetextComponent from '../components/freetext';

import FreetextCardContainer from './card-freetext';

// types
import { IState } from 'client/state';
import { ICard } from '../types';

// selectors
import { select_card } from 'client/packages/cards/selectors';
import {
    select_data,
    select_data_for_collection
} from 'client/packages/data/selectors';

// actions
import {
    create_data,
    update_data,
    get_data
} from 'client/packages/data/actions';
import { get_card, update_card } from 'client/packages/cards/actions';

interface IPassedProps {
    card_id: string;
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    card: ICard;
    data;
    collection_data;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardViewContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.card._id) {
            this.props.dispatch(get_card(this.props.card_id));
        }

        if (!this.props.data) {
            this.props.dispatch(
                get_data({
                    collection_id: this.props.collection_id,
                    card_id: this.props.card._id
                })
            );
        }
    }

    public render() {
        const card = this.props.card;
        const data = this.props.data;

        if (card) {
            switch (card.card_type) {
                case 'multiplechoice':
                    return (
                        <MultiplechoiceCardComponent
                            text={card.text}
                            items={card.items}
                            selected_items={data.items || []}
                            cb={(items, score) => {
                                this.props.collection_data.submitted
                                    ? noop()
                                    : this.props.dispatch(
                                          this.props.data._id
                                              ? update_data(
                                                    assign(
                                                        {},
                                                        this.props.data,
                                                        {
                                                            items,
                                                            score
                                                        }
                                                    )
                                                )
                                              : create_data({
                                                    items,
                                                    score,
                                                    data_type: 'card',
                                                    card_id: this.props.card
                                                        ._id,
                                                    collection_id: this.props
                                                        .collection_id
                                                })
                                      );
                            }}
                        />
                    );
                case 'freetext':
                    return (
                        <FreetextCardContainer
                            card_id={this.props.card_id}
                            collection_id={this.props.collection_id}
                        />
                    );
            }
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
        card: select_card(state, ownProps.card_id),
        collection_data: select_data_for_collection(
            state,
            ownProps.collection_id
        ),
        data: select_data(state, ownProps.collection_id, ownProps.card_id)
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
)(CardViewContainer);
