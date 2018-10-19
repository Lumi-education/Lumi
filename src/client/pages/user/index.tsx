import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from 'client/state';

import AppBar from './app-bar';
import LeftDrawer from './left-drawer';

import Sync from './sync';

// modules
import * as Users from 'lib/users';
import * as UI from 'lib/ui';
import * as Core from 'lib/core';

interface IStateProps {
    location;
    user_id: string;
    system: Core.types.ISystemSettings;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading: string;
    loading_step: number;
}

export class Root extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Benutzer', loading_step: 1 });
        this.props.dispatch(Users.actions.init_user()).then(res => {
            this.setState({ loading: 'finished', loading_step: 2 });
        });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage value={this.state.loading_step}>
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        if (this.props.system.mode === 'controlled') {
            if (this.props.location !== this.props.system.controlled_location) {
                this.props.dispatch(
                    UI.actions.push(this.props.system.controlled_location)
                );
            }
        }

        return (
            <div id="root">
                <Sync />
                <AppBar />
                <UI.container.AlarmDialog />
                <LeftDrawer />
                <div style={{ paddingBottom: '80px' }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        location: ownProps.location.pathname,
        user_id: state.users.me._id,
        system: state.core.system
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
)(Root);
