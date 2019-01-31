import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { setLocale } from 'react-redux-i18n';
import { IState } from 'client/state';

import AppBar from './AppBar';
import LeftDrawer from './LeftDrawer';

// pages
import FlowPage from './FlowPage';
import AssignmentPage from './AssignmentPage';
import CommentsPage from './CommentsPage';
import SettingsPage from './SettingsPage';

import MaterialFetchContainer from './MaterialFetchContainer';

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
                <MaterialFetchContainer />
                <AppBar />
                <LeftDrawer />
                <div style={{ paddingBottom: '80px' }}>
                    <Switch>
                        <Route
                            exact={true}
                            path="/:db/user"
                            component={FlowPage}
                        />
                        {/* <Route
                            exact={true}
                            path="/user/settings"
                            component={SettingsPage}
                        /> */}
                        <Route path="/:db/user/flow" component={FlowPage} />
                        <Route
                            exact={true}
                            path="/:db/user/assignment/:assignment_id"
                            component={AssignmentPage}
                        />
                        <Route
                            exact={true}
                            path="/:db/user/assignment/:ref_id/comments"
                            component={CommentsPage}
                        />
                        <Route
                            path="/:db/user/comments/:ref_id"
                            component={CommentsPage}
                        />
                    </Switch>
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
