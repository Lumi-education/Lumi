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

import CreateCardDialog from './dialogs/create-card';
import AssignmentDialog from './dialogs/assignment-dialog';

interface IStateProps {
    location;
    userlevel: number;
    right_appbar_icon: JSX.Element;
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
        right_appbar_icon: state.ui.right_appbar_icon
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
