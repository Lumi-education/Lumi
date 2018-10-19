import * as React from 'react';
import { connect } from 'react-redux';

// container
import LeftDrawer from './left-drawer';
import RightDrawer from './right-drawer';
import Snackbar from './snackbar';
import AppBar from './app-bar';

// state
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Users from 'lib/users';
import * as Core from 'lib/core';

import CreateCardDialog from './dialogs/create-card';
import AssignmentDialog from './dialogs/assignment-dialog';

interface IStateProps {
    location;
    userlevel: number;
    right_appbar_icon: JSX.Element;
    user_id: string;
    status_page: boolean;
    status_page_text: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminRoot extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (this.props.userlevel < 2) {
            this.props.dispatch(UI.actions.push('/user'));
        }

        this.props.dispatch(Users.actions.init_user());
        this.props.dispatch(Core.actions.check_update());
    }

    public render() {
        return (
            <div id="AdminRoot">
                <AppBar />
                <LeftDrawer />
                <RightDrawer />
                <CreateCardDialog />
                <AssignmentDialog />
                <Snackbar />
                {this.props.status_page ? (
                    <UI.components.StatusPage
                        text={this.props.status_page_text}
                    />
                ) : null}
                <div style={{ paddingBottom: '40px' }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        location: ownProps.location,
        userlevel: state.auth.userlevel,
        right_appbar_icon: state.ui.right_appbar_icon,
        user_id: state.users.me._id,
        status_page: state.core.status.status_page,
        status_page_text: state.core.status.status_page_text
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminRoot);
