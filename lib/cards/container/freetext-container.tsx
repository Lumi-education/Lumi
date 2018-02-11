// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';

import { convert_attachment_url } from '../utils';

// components
import FreetextComponent from '../components/freetext';

// modules
import * as Cards from '../';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    user_id?: string;
    card_id: string;
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IFreetextCard;
    data: Cards.IFreetextCardData;
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

        if (!this.props.data._id) {
            this.props
                .dispatch(
                    Cards.actions.get_card_data(
                        this.props.user_id,
                        this.props.collection_id,
                        this.props.card_id
                    )
                )
                .then(res => {
                    if (res.response.status === 404) {
                        this.log('no data found. creating..');
                        this.props
                            .dispatch(
                                Cards.actions.create_data<
                                    Cards.IFreetextCardData
                                >({
                                    _id:
                                        this.props.user_id +
                                        '-' +
                                        this.props.collection_id +
                                        '-' +
                                        this.props.card_id,
                                    type: 'data',
                                    user_id: this.props.user_id,
                                    created_at: undefined,
                                    updated_at: undefined,
                                    score: 0,
                                    show_answer: false,
                                    card_type: 'freetext',
                                    answer: '',
                                    is_graded: true,
                                    graded: false,
                                    auto_grade: this.props.card.auto_grade,
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
    }

    public handleInput(answer: string) {
        const score = this.props.card.auto_grade
            ? answer.replace(/\s/, '') ===
              this.props.card.answer.replace(/\s/, '')
              ? 1
              : 0
            : this.props.data.score;

        this.setState({
            error_text: 'saving...',
            error_style: { color: '#e67e22' }
        });

        this.log('score: ' + score);
        this.props
            .dispatch(
                Cards.actions.update_data(
                    assign(
                        {},
                        this.props.data,
                        { graded: this.props.data.auto_grade },
                        { score, answer }
                    )
                )
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
                    cb={this.handleInput}
                    preview={card.preview}
                    error_text={this.state.error_text}
                    error_style={this.state.error_style}
                />
            );
        }

        return <div>{this.state.status}</div>;
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        user_id,
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
        card: Cards.selectors.select_card(
            state,
            ownProps.card_id
        ) as Cards.IFreetextCard,
        data: Cards.selectors.select_data(
            state,
            user_id,
            ownProps.collection_id,
            ownProps.card_id
        ) as Cards.IFreetextCardData
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
