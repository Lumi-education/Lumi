// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';

import { convert_attachment_url } from '../utils';

// components
import FreetextComponent from '../components/freetext-component';

// types
import {
    IFreetextCard,
    IFreetextCardData,
    ICollectionData,
    IState
} from '../types';

// selectors
import { select_card } from 'lib/cards/selectors';
import { select_data, select_collection } from 'lib/data/selectors';

// actions
import { create_data, update_data, get_data } from 'lib/data/actions';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    user_id?: string;
    card_id: string;
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    card: IFreetextCard;
    data: IFreetextCardData;
    collection_data: ICollectionData;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading?: boolean;
    status?: string;
    error_text?: string;
    error_style?;
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
            status: 'init',
            error_text: null,
            error_style: {
                color: '#e67e22'
            }
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
                                is_graded: true,
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

        if (this.props.collection_data.submitted) {
            this.setState({
                error_text: 'Richtige Antwort: ' + this.props.card.answer
            });
        }
    }

    public handleInput(answer: string) {
        const score =
            answer.replace(/\s/, '') ===
            this.props.card.answer.replace(/\s/, '')
                ? 1
                : 0;

        this.setState({
            error_text: 'saving...',
            error_style: { color: '#e67e22' }
        });

        this.log('score: ' + score);
        this.props
            .dispatch(
                update_data(assign({}, this.props.data, { score, answer }))
            )
            .then(res => {
                this.setState({
                    error_text: 'saved',
                    error_style: { color: '#27ae60' }
                });
                setTimeout(
                    () =>
                        this.setState({
                            error_text: null,
                            error_style: { color: '#e67e22' }
                        }),
                    1000
                );
            });
    }

    public render() {
        const { card, data } = this.props;

        if (card && data) {
            const text = convert_attachment_url(card.text, card._id);
            return (
                <FreetextComponent
                    text={text}
                    answer={data.answer}
                    cb={
                        this.props.collection_data.submitted
                            ? noop
                            : this.handleInput
                    }
                    preview={card.preview}
                    error_text={this.state.error_text}
                    error_style={this.state.error_style}
                />
            );
        }

        return <div>{this.state.status}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
        card: select_card(state, ownProps.card_id) as IFreetextCard,
        collection_data: select_collection(state, ownProps.collection_id),
        data: select_data(
            state,
            user_id,
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
