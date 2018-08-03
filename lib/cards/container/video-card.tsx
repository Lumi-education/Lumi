// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';
import * as raven from 'raven-js';

// components
import VideoCardComponent from '../components/video';

import * as Cards from '../';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IVideoCard;
    data: Cards.IVideoCardData;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading?: boolean;
    status?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class VideoCardContainer extends React.Component<
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
    }

    public log(msg: string) {
        log(msg);
        this.setState({ status: msg });
    }

    public componentWillMount() {
        this.log('checking for data');
        this.props
            .dispatch(
                Cards.actions.get_card_data(
                    this.props.user_id,
                    this.props.assignment_id,
                    this.props.card_id
                )
            )
            .then(res => {
                if (res.response.status === 404) {
                    raven.captureMessage('data not found');
                    this.log('no data found. creating..');
                    this.props
                        .dispatch(
                            Cards.actions.create_data<Cards.IVideoCardData>({
                                _id:
                                    this.props.user_id +
                                    '-' +
                                    this.props.assignment_id +
                                    '-' +
                                    this.props.card_id,
                                type: 'data',
                                user_id: this.props.user_id,
                                created_at: undefined,
                                updated_at: undefined,
                                card_type: 'video',
                                processed: true,
                                show_answer: false,
                                is_graded: false,
                                data_type: 'card',
                                graded: true,
                                score: 0,
                                card_id: this.props.card._id,
                                assignment_id: this.props.assignment_id
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

    public componentDidMount() {
        if (!this.props.data.processed) {
            this.props.dispatch(
                Cards.actions.update_data(
                    assign({}, this.props.data, { processed: true })
                )
            );
        }
    }

    public render() {
        const { card, data } = this.props;

        if (card && data) {
            return <VideoCardComponent {...this.props.card} />;
        }

        return <div>{this.state.status}</div>;
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        user_id,
        card_id: ownProps.card_id,
        assignment_id: ownProps.assignment_id,
        card: Cards.selectors.select_card(
            state,
            ownProps.card_id
        ) as Cards.IVideoCard,
        data: Cards.selectors.select_data(
            state,
            user_id,
            ownProps.assignment_id,
            ownProps.card_id
        ) as Cards.IVideoCardData
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
)(VideoCardContainer);
