// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';

import { convert_attachment_url } from '../utils';

// components
import FreetextCardComponent from '../components/freetext';

// types
import { IState } from 'client/state';
import { IFreetextCard, IFreetextCardData } from '../types';

// selectors
import { select_card } from 'client/packages/cards/selectors';
import { select_data, select_collection } from 'client/packages/data/selectors';

// actions
import {
    create_data,
    update_data,
    get_data
} from 'client/packages/data/actions';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    card: IFreetextCard;
    data: IFreetextCardData;
    // collection_data;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading?: boolean;
    status?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class FreetextCardContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
            status: 'init'
        };

        this.log = this.log.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    public log(msg: string) {
        log(msg);
        this.setState({ status: msg });
    }

    public componentWillMount() {
        this.log('checking for data');
        this.props
            .dispatch(
                get_data({
                    collection_id: this.props.collection_id,
                    card_id: this.props.card._id
                })
            )
            .then(res => {
                if (res.payload.length === 0) {
                    this.log('no data found. creating..');
                    this.props
                        .dispatch(
                            create_data<IFreetextCardData>({
                                _id: undefined,
                                type: 'data',
                                user_id: undefined,
                                created_at: undefined,
                                updated_at: undefined,
                                score: 0,
                                card_type: 'freetext',
                                answer: '',
                                data_type: 'card',
                                card_id: this.props.card._id,
                                collection_id: this.props.collection_id
                            })
                        )
                        .then(create_res => {
                            this.log('data created.');
                            this.setState({ loading: false });
                        });
                } else {
                    this.log('data found.');
                    this.setState({ loading: false });
                }
            });
    }

    public handleInput(answer: string) {
        const score = answer === this.props.card.answer ? 1 : 0;

        this.log('score: ' + score);
        this.props.dispatch(
            update_data(assign({}, this.props.data, { score, answer }))
        );
    }

    public render() {
        const { card, data } = this.props;

        if (card && data) {
            const text = convert_attachment_url(card.text, card._id);
            return (
                <FreetextCardComponent
                    text={text}
                    answer={data.answer}
                    cb={this.handleInput}
                />
            );
        }

        return <div>{this.state.status}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
        card: select_card(state, ownProps.card_id) as IFreetextCard,
        // collection_data: select_collection(
        //     state,
        //     ownProps.collection_id
        // ),
        data: select_data(
            state,
            ownProps.collection_id,
            ownProps.card_id
        ) as IFreetextCardData
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
)(FreetextCardContainer);
