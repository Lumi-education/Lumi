// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import { Tabs, Tab } from 'material-ui/Tabs';

// types
import * as UI from 'lib/ui';
import { IState } from 'client/state';

import GroupUsersTab from './group-users-tab';

import * as Groups from 'lib/groups';
import GroupFlowTab from './group-flow-tab';
// actions
import { get_group } from 'lib/groups/actions';

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
        this.props.dispatch(get_group(this.props.group_id));
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
                        label="Settings"
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
                        label="Users"
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
                        label="Flow"
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
    return {
        group: Groups.selectors.select_group(state, ownProps.params.group_id),
        tab: ownProps.params.tab,
        group_id: ownProps.params.group_id
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
