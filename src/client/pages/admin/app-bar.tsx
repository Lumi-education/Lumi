import * as React from 'react';
import { connect } from 'react-redux';

import SVGSettings from 'material-ui/svg-icons/action/settings';
// components
import { AppBar, IconButton } from 'material-ui';

// state
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';

interface IStateProps {
    right_appbar_icon: JSX.Element;
    connected: boolean;
    mode: 'free' | 'controlled';
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminAppBar extends React.Component<IProps, {}> {
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
                showMenuIconButton={true}
                title="Lumi"
                onLeftIconButtonClick={() =>
                    this.props.dispatch(UI.actions.left_drawer_open())
                }
                onRightIconButtonClick={() =>
                    this.props.dispatch(UI.actions.right_drawer_open())
                }
                iconElementRight={
                    <IconButton>
                        <SVGSettings />
                    </IconButton>
                }
            />
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        right_appbar_icon: state.ui.right_appbar_icon,
        connected: state.core.status.connected,
        mode: state.core.system.mode
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
)(AdminAppBar);
