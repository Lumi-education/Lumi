import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { setLocale } from 'react-redux-i18n';
import { IState } from 'client/state';

import AppBar from './app-bar';
import LeftDrawer from './left-drawer';

import Sync from './sync';

// pages
import FlowPage from './flow';
import AssignmentPage from './assignment';
import CommentsPage from './comments';
import CardsPage from './cards';
import SettingsPage from './settings';

// modules
import * as Users from 'lib/users';
import * as UI from 'lib/ui';
import * as Core from 'lib/core';

interface IStateProps {
    location;
    user_id: string;
    system: Core.types.ISystemSettings;
    locale: Core.types.Locales;
    me: Users.IUser;
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
        this.setState({ loading: Core.i18n.t('user'), loading_step: 1 });
        this.props.dispatch(Users.actions.init_user()).then(res => {
            const user =
                res.payload.filter(docs => docs.type === 'user')[0] || {};
            if (user.language) {
                this.props.dispatch(setLocale(user.language));
            }

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
            <div id="root" key={this.props.locale}>
                <Sync />
                <AppBar />
                <UI.container.AlarmDialog />
                <LeftDrawer />
                <div style={{ paddingBottom: '80px' }}>
                    <Switch>
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
                        <Route
                            path="/user/cards/:card_id"
                            component={CardsPage}
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
