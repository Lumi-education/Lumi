import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import * as debug from 'debug';

// container
import LeftDrawer from './left-drawer';
import AppBar from './app-bar';

// state
import { IState } from 'client/state';

// pages
import ErrorBoundary from 'client/pages/error-boundary';

import GroupPage from 'client/pages/admin/groups/group-page';
import GroupsPage from 'client/pages/admin/groups/groups-page';
import UsersPage from './users/users-page';
import UserPage from './users/user-page';
import CardsPage from './cards/cards-page';
import CardPage from './cards/card-page';
import CommentsPage from './comments/comments-page';
import SystemPage from './system/system-page';
import DashboardPage from './dashboard/dashboard-page';
import SettingsPage from './settings-page';

// modules
import * as UI from 'lib/ui';
import * as Core from 'lib/core';

import CreateCardDialog from 'client/dialogs/card-create-dialog';
import AssignmentDialog from 'client/dialogs/assignment-view-dialog';

const log = debug('lumi:client:pages:admin:index');

interface IStateProps {
    userlevel: number;
    user_id: string;
    status_page: boolean;
    status_page_text: string;
    locale: Core.types.Locales;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminRoot extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        log('componentWillMount');
        if (this.props.userlevel < 2) {
            this.props.dispatch(UI.actions.push('/user'));
        }
        this.props.dispatch(Core.actions.check_update());
    }

    public render() {
        return (
            <div id="AdminRoot" key={this.props.locale}>
                <ErrorBoundary>
                    <AppBar />
                </ErrorBoundary>
                <ErrorBoundary>
                    <LeftDrawer />
                </ErrorBoundary>
                <ErrorBoundary>
                    <CreateCardDialog />
                </ErrorBoundary>
                <ErrorBoundary>
                    <AssignmentDialog />
                </ErrorBoundary>
                <div
                    style={{
                        paddingBottom: '40px'
                    }}
                >
                    <ErrorBoundary>
                        <Switch>
                            <Route
                                exact={true}
                                path="/:db/admin"
                                component={DashboardPage}
                            />
                            <Route
                                exact={true}
                                path="/:db/admin/dashboard"
                                component={DashboardPage}
                            />
                            <Route
                                exact={true}
                                path="/:db/admin/groups"
                                component={GroupsPage}
                            />
                            <Route
                                path="/:db/admin/groups/:group_id/:tab"
                                component={GroupPage}
                            />
                            <Route
                                path="/:db/admin/groups/:group_id"
                                component={GroupPage}
                            />
                            <Route
                                exact={true}
                                path="/:db/admin/users"
                                component={UsersPage}
                            />
                            <Route
                                path="/:db/admin/users/:user_id/:tab"
                                component={UserPage}
                            />
                            <Route
                                path="/:db/admin/users/:user_id"
                                component={UserPage}
                            />
                            <Route
                                path="/:db/admin/cards/:card_id"
                                component={CardPage}
                            />
                            <Route
                                exact={true}
                                path="/:db/admin/cards"
                                component={CardsPage}
                            />
                            <Route
                                path="/:db/admin/comments"
                                component={CommentsPage}
                            />
                            <Route
                                path="/:db/admin/system/:tab"
                                component={SystemPage}
                            />
                            <Route
                                path="/:db/admin/system"
                                component={SystemPage}
                            />
                            <Route
                                path="/:db/admin/settings"
                                component={SettingsPage}
                            />
                        </Switch>
                    </ErrorBoundary>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        userlevel: state.auth.userlevel,
        user_id: state.users.me._id,
        status_page: state.core.status.status_page,
        status_page_text: state.core.status.status_page_text,
        locale: state.i18n.locale
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    contentContainer: {
        maxWidth: '680px',
        margin: 'auto'
    }
});

export default withRouter(
    withStyles(styles)(
        connect<{}, {}, {}>(
            mapStateToProps,
            mapDispatchToProps
        )(AdminRoot)
    )
);
