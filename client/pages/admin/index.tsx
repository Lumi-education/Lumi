import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { setLocale } from 'react-redux-i18n';

import * as debug from 'debug';

// container
import LeftDrawer from './left-drawer';
import RightDrawer from './right-drawer';
import AppBar from './app-bar';

// state
import { IState } from 'client/state';

// pages
import ErrorBoundary from 'client/pages/error-boundary';

import ActivityPage from './activity/activity-page';
import GroupPage from 'client/pages/admin/groups/group-page';
import GroupsPage from 'client/pages/admin/groups/groups-page';
import Lessons from 'client/pages/admin/lessons/lesson-page';
import UsersPage from './users/users-page';
import UserPage from './users/user-page';
import CardsPage from './cards/cards-page';
import CardPage from './cards/card-page';
import FoldersPage from './folders/folders-page';
import TagsPage from './tags/tags-page';
import TagPage from './tags/tag-page';
import CommentsPage from './comments/comments-page';
import SystemPage from './system/system-page';
import DashboardPage from './dashboard/dashboard-page';
import SettingsPage from './settings-page';
import TutorialMacPage from './tutorial/get-connected-mac';
import AssistantPage from './assistant/assistant-page';

// modules
import * as UI from 'lib/ui';
import * as Users from 'lib/users';
import * as Core from 'lib/core';

import CreateCardDialog from 'client/dialogs/card-create-dialog';
import AssignmentDialog from 'client/dialogs/assignment-view-dialog';

const log = debug('lumi:client:pages:admin:index');

interface IStateProps {
    userlevel: number;
    right_appbar_icon: JSX.Element;
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

        this.props.dispatch(Users.actions.init_user()).then(res => {
            const user =
                res.payload.filter(docs => docs.type === 'user')[0] || {};
            if (user.language) {
                this.props.dispatch(setLocale(user.language));
            }
        });
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
                    <RightDrawer />
                </ErrorBoundary>
                <ErrorBoundary>
                    <CreateCardDialog />
                </ErrorBoundary>
                <ErrorBoundary>
                    <AssignmentDialog />
                </ErrorBoundary>

                {this.props.status_page ? (
                    <UI.components.StatusPage
                        text={this.props.status_page_text}
                    />
                ) : null}
                <div
                    style={{
                        paddingBottom: '40px'
                    }}
                >
                    <ErrorBoundary>
                        <Switch>
                            <Route
                                exact={true}
                                path="/admin"
                                component={DashboardPage}
                            />
                            <Route
                                exact={true}
                                path="/admin/dashboard"
                                component={DashboardPage}
                            />
                            <Route
                                exact={true}
                                path="/admin/groups"
                                component={GroupsPage}
                            />
                            <Route
                                path="/admin/groups/:group_id/:tab"
                                component={GroupPage}
                            />
                            <Route
                                path="/admin/groups/:group_id"
                                component={GroupPage}
                            />
                            <Route
                                exact={true}
                                path="/admin/users"
                                component={UsersPage}
                            />
                            <Route
                                path="/admin/users/:user_id/:tab"
                                component={UserPage}
                            />
                            <Route
                                path="/admin/users/:user_id"
                                component={UserPage}
                            />
                            <Route path="/admin/lessons" component={Lessons} />
                            <Route
                                path="/admin/cards/:card_id"
                                component={CardPage}
                            />
                            <Route
                                exact={true}
                                path="/admin/cards"
                                component={CardsPage}
                            />
                            <Route
                                path="/admin/folders/:folder_id"
                                component={FoldersPage}
                            />
                            <Route
                                path="/admin/tags/:tag_id/:tab"
                                component={TagPage}
                            />
                            <Route
                                path="/admin/tags/:tag_id"
                                component={TagPage}
                            />
                            <Route
                                exact={true}
                                path="/admin/tags"
                                component={TagsPage}
                            />
                            <Route
                                exact={true}
                                path="/admin/activity"
                                component={ActivityPage}
                            />
                            <Route
                                path="/admin/comments"
                                component={CommentsPage}
                            />
                            <Route
                                path="/admin/system/:tab"
                                component={SystemPage}
                            />
                            <Route
                                path="/admin/system"
                                component={SystemPage}
                            />
                            <Route
                                path="/admin/settings"
                                component={SettingsPage}
                            />
                            <Route
                                path="/admin/tutorial/get-connected-mac"
                                component={TutorialMacPage}
                            />
                            <Route
                                path="/admin/assistant"
                                component={AssistantPage}
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
        right_appbar_icon: state.ui.right_appbar_icon,
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
