// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';
import raven from 'lib/core/raven';

// components
import VideoCardComponent from '../components/video';

import * as Cards from '../';
import * as Flow from 'lib/flow';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IVideoCard;
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
        this.props.dispatch(
            Flow.actions.save_data(this.props.assignment_id, {
                state: 'viewed',
                score: 1,
                maxScore: 1,
                finished: new Date().getTime()
            })
        );
    }

    public render() {
        const { card } = this.props;

        if (card) {
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
        ) as Cards.IVideoCard
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
