// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import { Map } from 'immutable';

import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Tabs, Tab } from 'material-ui/Tabs';

// selectors
// import { select_users_for_group } from 'client/packages/groups/selectors';

// types
import { IState } from 'client/state';
import { ICollection } from 'common/types';
import { IUser, UserListContainer } from 'client/packages/users';
import {
    IGroup,
    GroupSettingsContainer,
    group_selectors
} from 'client/packages/groups';

// actions
import { get_group } from 'client/packages/groups/actions';

interface IStateProps {
    group_id: string;
    tab: string;
    group_users: string[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminGroup extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(get_group(this.props.group_id));
    }

    public render() {
        return (
            <div>
                <Tabs
                    style={{
                        position: 'fixed',
                        backgroundColor: '#FFFFFF',
                        top: '64px',
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
                        label="Collections"
                        value="collections"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/groups/' +
                                        this.props.group_id +
                                        '/collections'
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
                                <GroupSettingsContainer
                                    group_id={this.props.group_id}
                                />
                            );
                        case 'users':
                            return (
                                <UserListContainer
                                    filter={(user: IUser) =>
                                        this.props.group_users.indexOf(
                                            user._id
                                        ) > -1
                                    }
                                />
                            );
                        case 'collections':
                            return <div>collections</div>;
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group_users: group_selectors.select_users_for_group(
            state,
            ownProps.params.group_id
        ),
        tab: ownProps.params.tab,
        group_id: ownProps.params.group_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminGroup
);
