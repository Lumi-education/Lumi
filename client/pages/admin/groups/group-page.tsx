// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import { Tabs, Tab } from 'material-ui/Tabs';

// types
import { IState } from 'client/state';

import GroupUsersTab from './group-users-tab';
import GroupFlowTab from './group-flow-tab';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as UI from 'lib/ui';

interface IStateProps {
    group_id: string;
    tab: string;
    group: Groups.IGroup;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {
    show_user_dialog: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminGroup extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false
        };
    }

    public componentWillMount() {
        this.props.dispatch(Groups.actions.get_group(this.props.group_id));
    }

    public render() {
        if (!this.props.group._id) {
            return (
                <UI.components.LoadingPage>
                    Lade Gruppe
                </UI.components.LoadingPage>
            );
        }

        return (
            <div>
                <Tabs
                    style={{
                        backgroundColor: '#FFFFFF',
                        zIndex: 1099,
                        width: '100%'
                    }}
                    tabItemContainerStyle={{
                        background: UI.config.gradient_bg
                    }}
                    value={this.props.tab}
                >
                    <Tab
                        label={Core.i18n.t('settings')}
                        value="settings"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/groups/' +
                                        this.props.group_id +
                                        '/settings'
                                )
                            )
                        }
                    />
                    <Tab
                        label={Core.i18n.t('users')}
                        value="users"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/groups/' +
                                        this.props.group_id +
                                        '/users'
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
                                    '/admin/groups/' +
                                        this.props.group_id +
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
                                <Groups.GroupSettingsContainer
                                    group_id={this.props.group_id}
                                />
                            );
                        case 'users':
                            return (
                                <div>
                                    <GroupUsersTab
                                        group_id={this.props.group_id}
                                    />
                                </div>
                            );
                        case 'flow':
                            return (
                                <GroupFlowTab group_id={this.props.group_id} />
                            );
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const group_id = ownProps.match.params.group_id;
    return {
        group_id,
        group: Groups.selectors.select_group(state, group_id),
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
)(AdminGroup);
