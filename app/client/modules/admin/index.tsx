import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import * as shortid from 'shortid';
import { IState } from 'client/state';

// components
import AppBar from 'material-ui/AppBar';
import LeftDrawer from './left-drawer';
import Snackbar from './snackbar';

// actions
import {
    left_drawer_close,
    left_drawer_open
} from 'client/packages/ui/actions';

interface IStateProps {
    request: {};
    location;
    userlevel: number;
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
                        this.props.dispatch(left_drawer_open())}
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
        request: state.request,
        location: ownProps.location,
        userlevel: state.auth.userlevel
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
