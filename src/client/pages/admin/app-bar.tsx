import * as React from 'react';
import {connect} from 'react-redux';

// components
import {AppBar} from 'material-ui';

// container
import LeftDrawer from './left-drawer';
import RightDrawer from './right-drawer';

// state
import {IState} from 'client/state';

// modules
import {actions as ui_actions} from 'lib/ui';
import {random_bg} from 'lib/ui/utils';
import * as Grades from 'lib/grades';

interface IStateProps {
    right_appbar_icon: JSX.Element;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminAppBar extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <AppBar
                style={{
                    background: 'linear-gradient(120deg, #8e44ad, #3498db)'
                }}
                showMenuIconButton={true}
                title="Lumi"
                onLeftIconButtonTouchTap={() =>
                    this.props.dispatch(ui_actions.left_drawer_open())
                }
                onRightIconButtonTouchTap={() =>
                    this.props.dispatch(ui_actions.right_drawer_open())
                }
            />
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {right_appbar_icon: state.ui.right_appbar_icon};
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminAppBar);
