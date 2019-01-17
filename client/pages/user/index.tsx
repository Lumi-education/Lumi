import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { setLocale } from 'react-redux-i18n';
import { IState } from 'client/state';

import AppBar from './app-bar';
import LeftDrawer from './left-drawer';

// pages
import FlowPage from './flow';
import AssignmentPage from './assignment';
import CommentsPage from './comments';
import SettingsPage from './settings';

// modules
import * as Users from 'lib/users';
import * as Core from 'lib/core';

interface IStateProps {
    location;
    user_id: string;
    system: Core.types.ISystemSettings;
    locale: Core.types.Locales;
    me: Users.models.User;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class Root extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <div id="root" key={this.props.locale}>
                <AppBar />
                <LeftDrawer />
                <div style={{ paddingBottom: '80px' }}>
                    {/* <Switch>
                        <Route exact={true} path="/user" component={FlowPage} />
                        <Route
                            exact={true}
                            path="/user/settings"
                            component={SettingsPage}
                        />
                        <Route path="/user/flow" component={FlowPage} />
                        <Route
                            exact={true}
                            path="/user/assignment/:assignment_id"
                            component={AssignmentPage}
                        />
                        <Route
                            exact={true}
                            path="/user/assignment/:ref_id/comments"
                            component={CommentsPage}
                        />
                        <Route
                            path="/user/comments/:ref_id"
                            component={CommentsPage}
                        />
                    </Switch> */}
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        location: ownProps.location.pathname,
        user_id: state.users.me._id,
        system: state.core.system,
        locale: state.i18n.locale,
        me: state.users.me
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withRouter(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(Root)
);
