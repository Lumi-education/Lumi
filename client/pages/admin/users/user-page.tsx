// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as debug from 'debug';

import { Paper, Tabs, Tab } from 'material-ui';

import UserFlowTab from './user-flow-tab';
import UserAnalyticsTab from './user-analytics-tab';
import UserSettingsTab from './user-settings-tab';

// state
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';
import * as Groups from 'lib/groups';

interface IStateProps {
    user_id: string;
    user: Users.models.User;
    select_user: (user_id: string) => Users.models.User;
    tab: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading?: string;
    loading_step?: number;
}

export class AdminUserPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.props.dispatch(
            Users.actions.change_user(
                this.props.select_user(this.props.user_id)
            )
        );
    }

    public render() {
        return (
            <div>
                <Tabs
                    style={{
                        backgroundColor: '#FFFFFF',
                        zIndex: 1099,
                        width: '100%'
                    }}
                    value={this.props.tab}
                >
                    <Tab
                        label={Core.i18n.t('settings')}
                        value="settings"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/users/' +
                                        this.props.user_id +
                                        '/settings'
                                )
                            )
                        }
                    />
                    <Tab
                        label={Core.i18n.t('analytics')}
                        value="analytics"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/users/' +
                                        this.props.user_id +
                                        '/analytics'
                                )
                            )
                        }
                    />
                    <Tab
                        label={Core.i18n.t('flow')}
                        value="flow"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/users/' +
                                        this.props.user_id +
                                        '/flow'
                                )
                            )
                        }
                    />
                </Tabs>
                {(() => {
                    switch (this.props.tab) {
                        case 'settings':
                        default:
                            return (
                                <UserSettingsTab user_id={this.props.user_id} />
                            );
                        case 'analytics':
                            return (
                                <UserAnalyticsTab
                                    user_id={this.props.user_id}
                                />
                            );
                        case 'flow':
                            return <UserFlowTab user_id={this.props.user_id} />;
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.match.params.user_id;
    return {
        user_id,
        user: state.users.ui.user,
        select_user: (_user_id: string) =>
            Users.selectors.user(state, _user_id),
        tab: ownProps.match.params.tab || 'settings'
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminUserPage);
