// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';

import { convert_attachment_url } from '../utils';

// components
import MultiplechoiceComponent from 'lib/cards/components/multiplechoice';

// modules
import * as Cards from '../';

const log = debug('lumi:packages:cards:container:multiplechoice-card');

interface IPassedProps {
    card_id: string;
    collection_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IMultiplechoiceCard;
    data: Cards.IMultiplechoiceCardData;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class MultiplechoiceCardViewContainer extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);

        this.log = this.log.bind(this);
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
                                    Cards.IMultiplechoiceCardData
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
                                    card_type: 'multiplechoice',
                                    items: [],
                                    graded: true,
                                    show_answer: false,
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
        }
    }

    public render() {
        const { card, data } = this.props;

        if (card && data) {
            return (
                <MultiplechoiceComponent
                    _id={card._id}
                    text={card.text}
                    items={card.items}
                    selected_items={data.items || []}
                    show_correct_values={this.props.data.show_answer}
                    cb={(items, score) => {
                        this.props.dispatch(
                            Cards.actions.update_data(
                                assign({}, this.props.data, {
                                    items,
                                    score
                                })
                            )
                        );
                    }}
                />
            );
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        user_id: ownProps.user_id || (state as any).auth.user_id,
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
        card: Cards.selectors.select_card(
            state,
            ownProps.card_id
        ) as Cards.IMultiplechoiceCard,
        data: Cards.selectors.select_data(
            state,
            user_id,
            ownProps.collection_id,
            ownProps.card_id
        ) as Cards.IMultiplechoiceCardData
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
)(MultiplechoiceCardViewContainer);
