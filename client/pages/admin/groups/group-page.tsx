// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { push } from 'lib/ui/actions';

import { Tabs, Tab } from 'material-ui/Tabs';

// types
import { IState } from 'client/state';

import GroupUsersTab from './group-users-tab';
import GroupFlowTab from './group-flow-tab';
import GroupSettingsTab from './group-settings-tab';
import GroupCardsTab from './group-cards-tab';
import GroupAssignmentTableTab from './GroupAssignmentsTableTab';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as UI from 'lib/ui';

const log_info = debug('lumi:pages:admin:groups:group-page');
interface IStateProps {
    group_id: string;
    tab: string;
    group: Groups.models.Group;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminGroup extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init'
        };
    }

    public componentWillMount() {
        log_info('componentWillMount');
        this.props.dispatch(Groups.actions.change_group(this.props.group));
    }

    public componentWillUnmount() {
        log_info('componentWillUnmount');
        this.props.dispatch(Groups.actions.reset_ui_group());
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
                    {/* <Tab
                        label={Core.i18n.t('cards')}
                        value="cards"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/groups/' +
                                        this.props.group_id +
                                        '/cards'
                                )
                            )
                        }
                    /> */}
                </Tabs>
                {(() => {
                    switch (this.props.tab) {
                        case 'settings':
                            return (
                                <GroupSettingsTab
                                    group_id={this.props.group_id}
                                />
                            );
                        default:
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
                                <GroupAssignmentTableTab
                                    group_id={this.props.group_id}
                                />
                                // <GroupFlowTab group_id={this.props.group_id} />
                            );
                        case 'cards':
                            return (
                                <GroupCardsTab group_id={this.props.group_id} />
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
        group: Groups.selectors.group(state, group_id),
        tab: ownProps.match.params.tab || 'users'
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
