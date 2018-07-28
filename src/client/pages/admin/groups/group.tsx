// modules
import * as React from 'react';
import {connect} from 'react-redux';
import {push} from 'lib/ui/actions';
import {Map} from 'immutable';

import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Tabs, Tab} from 'material-ui/Tabs';

import UserTable from 'client/composites/user-table';

// types
import {ActionBar} from 'lib/ui';
import {IState} from 'client/state';
import {ICollection} from 'lib/collections/types';
import * as Users from 'lib/users';

import GroupUsersTab from './group-users-tab';

import * as Groups from 'lib/groups';

import GroupFlowTab from './group-flow-tab';
// actions
import {get_group} from 'lib/groups/actions';

interface IStateProps {
    group_id: string;
    tab: string;
    // group_users: string[];
    group: Groups.IGroup;
    selected_collections: string[];
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
            return <div>loading</div>;
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
                        background: 'linear-gradient(120deg, #8e44ad, #3498db)'
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
                                    <ActionBar />
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
        // group_users: Users.selectors
        //     .users_in_group(state, ownProps.params.group_id)
        //     .map(user => user._id),
        group: Groups.selectors.select_group(state, ownProps.params.group_id),
        tab: ownProps.params.tab,
        selected_collections: state.collections.ui.selected_collections,
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
