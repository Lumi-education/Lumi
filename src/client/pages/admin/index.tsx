import * as React from 'react';
import { connect } from 'react-redux';

import * as shortid from 'shortid';
import { IState } from 'client/state';

// components
import AppBar from 'material-ui/AppBar';
import LeftDrawer from './left-drawer';
import Snackbar from './snackbar';

// actions
import {
    left_drawer_close,
    left_drawer_open,
    right_drawer_open,
    push
} from 'lib/ui/actions';

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
            this.props.dispatch(push('/user'));
        }
    }

    public render() {
        return (
            <div id="AdminRoot">
                <AppBar
                    style={{
                        position: 'fixed',
                        background: 'linear-gradient(120deg, #8e44ad, #3498db)'
                    }}
                    showMenuIconButton={true}
                    onLeftIconButtonTouchTap={() =>
                        this.props.dispatch(left_drawer_open())
                    }
                    iconElementRight={this.props.right_appbar_icon}
                    onRightIconButtonTouchTap={() =>
                        this.props.dispatch(right_drawer_open())
                    }
                />
                <LeftDrawer />
                <div style={{ paddingTop: '120px', paddingBottom: '40px' }}>
                    {this.props.children}
                </div>
                <Snackbar />
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

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminRoot
);
