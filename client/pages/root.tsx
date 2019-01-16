import * as React from 'react';
import { connect } from 'react-redux';
import raven from 'lib/core/raven';
import * as debug from 'debug';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

import { IState } from 'lib/core/types';

import * as Core from 'lib/core';
import * as DB from 'lib/db';

import Auth from 'lib/auth/container/auth';
import InstallPage from './install';

import Landing from './landing';
import Admin from './admin';
import User from './user';
import UserPrintCards from './admin/users/UserPrintCards';

import NotifierContainer from 'lib/notifications/container/Notifier';

import ErrorBoundary from './error-boundary';

const log = debug('lumi:pages:root');

interface IStateProps {
    connected: boolean;
    installed: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}
interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class RootContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Core.actions.get_settings());
    }

    public render() {
        return (
            <div id="root">
                <ErrorBoundary>
                    <NotifierContainer />
                    <Route
                        exact={true}
                        path="/"
                        render={() => <Redirect to="/lumi" />}
                    />
                    {this.props.installed ? (
                        <div>
                            <Auth>
                                <DB.container.db>
                                    <Switch>
                                        <Route
                                            exact={true}
                                            path="/:db/admin/userprintcards"
                                            component={UserPrintCards}
                                        />
                                        <Route
                                            path="/:db/admin"
                                            component={Admin}
                                        />
                                        <Route
                                            path="/:db/user"
                                            component={User}
                                        />
                                        <Route
                                            exact={true}
                                            path="/:db"
                                            component={Landing}
                                        />
                                    </Switch>
                                </DB.container.db>
                            </Auth>
                        </div>
                    ) : (
                        <InstallPage />
                    )}
                </ErrorBoundary>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        connected: state.core.status.connected,
        installed: state.core.system.installed
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
)(RootContainer);
