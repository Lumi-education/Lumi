// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { AppBar } from 'material-ui';

// local
import { IState } from 'client/state';

// actions
import { right_drawer_open, left_drawer_open } from 'lib/ui/actions';

interface IStateProps {
    right_appbar_icon: JSX.Element;
    appbar_title: string;
    connected: boolean;
    mode: 'free' | 'controlled';
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserAppBar extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.app_bar_bg = this.app_bar_bg.bind(this);
    }

    public app_bar_bg(): string {
        if (!this.props.connected) {
            return 'linear-gradient(90deg, #e74c3c, #f39c12)';
        }

        if (this.props.mode === 'controlled') {
            return 'linear-gradient(90deg, #8e44ad, #2980b9)';
        }

        return 'linear-gradient(90deg, #3498db, #1abc9c)';
    }

    public render() {
        return (
            <AppBar
                style={{
                    background: this.app_bar_bg()
                }}
                showMenuIconButton={this.props.mode === 'free'}
                title={this.props.appbar_title}
                onLeftIconButtonTouchTap={() =>
                    this.props.dispatch(left_drawer_open())
                }
                iconElementRight={this.props.right_appbar_icon}
                onRightIconButtonTouchTap={() =>
                    this.props.dispatch(right_drawer_open())
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        right_appbar_icon: state.ui.right_appbar_icon,
        mode: state.core.system.mode,
        appbar_title: state.ui.appbar_title,
        connected: state.core.status.connected
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(UserAppBar);
