// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';

// components
import VideoCardComponent from '../components/video-card';

// types
import { IVideoCard, IVideoCardData, IState } from '../types';

// selectors
import { select_card } from 'lib/cards/selectors';
import { select_data, select_collection } from 'lib/data/selectors';

// actions
import { create_data, update_data, get_data } from 'lib/data/actions';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    card: IVideoCard;
    data: IVideoCardData;
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
                            create_data<IVideoCardData>({
                                _id: undefined,
                                type: 'data',
                                user_id: undefined,
                                created_at: undefined,
                                updated_at: undefined,
                                card_type: 'video',
                                data_type: 'card',
                                score: 0,
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

    public render() {
        const { card, data } = this.props;

        if (card && data) {
            return <VideoCardComponent {...this.props.card} />;
        }

        return <div>{this.state.status}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
        card: select_card(state, ownProps.card_id) as IVideoCard,
        data: select_data(
            state,
            ownProps.collection_id,
            ownProps.card_id
        ) as IVideoCardData
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
