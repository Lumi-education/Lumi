import * as React from 'react';
import { connect } from 'react-redux';
import { enqueueSnackbar, removeSnackbar } from '../actions';
import { IState } from 'client/state';

import Notification from '../components/Notification';
import * as Notifications from 'lib/notifications';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    notifications: Notifications.types.INotification[];
}

interface IDispatchProps {
    removeSnackbar: (key: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class NotifierContainer extends React.Component<
    IProps,
    IComponentState
> {
    public render() {
        return (
            <div id="notifications">
                {this.props.notifications.map((notification, index) => (
                    <Notification key={index} notification={notification} />
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        notifications: state.notifications
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeSnackbar: (key: string) => dispatch(removeSnackbar(key))
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(NotifierContainer);
