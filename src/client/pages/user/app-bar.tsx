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
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserAppBar extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <AppBar
                style={{
                    background: 'linear-gradient(120deg, #3498db, #1abc9c)'
                }}
                showMenuIconButton={true}
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
        appbar_title: state.ui.appbar_title
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
