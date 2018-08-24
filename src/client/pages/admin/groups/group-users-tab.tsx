// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { uniq } from 'lodash';

// types
import { IState } from 'client/state';

import { Avatar, Divider, List, ListItem, Paper } from 'material-ui';

import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

import Create_or_add_user_dialog from './create_or_add_user_dialog';
import { push } from 'lib/ui/actions';
// actions

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    users: Users.IUser[];
    group: (group_id: string) => Groups.IGroup;
    selected_users: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupUsersTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'init'
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'lade Schüler' });
        this.props
            .dispatch(
                Core.actions.find({
                    type: 'user',
                    groups: { $in: [this.props.group_id] }
                })
            )
            .then(user_response => {
                this.setState({ loading: 'finished' });
            });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage>
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        return (
            <div id="group-users-tab">
                <Paper>
                    <List>
                        {this.props.users.length === 0 ? (
                            <ListItem primaryText="Keine Schüler" />
                        ) : (
                            this.props.users
                                .sort(Core.utils.alphabetically)
                                .map(user => (
                                    <div key={user._id}>
                                        <ListItem
                                            onClick={() =>
                                                this.props.dispatch(
                                                    push(
                                                        '/admin/users/' +
                                                            user._id +
                                                            '/analytics'
                                                    )
                                                )
                                            }
                                            primaryText={user.name}
                                            leftAvatar={
                                                <Avatar
                                                    style={{
                                                        background:
                                                            this.props.selected_users.indexOf(
                                                                user._id
                                                            ) > -1
                                                                ? 'linear-gradient(120deg, #8e44ad, #3498db)'
                                                                : 'grey'
                                                    }}
                                                >
                                                    {user.name.substring(0, 3)}
                                                </Avatar>
                                            }
                                        />
                                        <Divider inset={true} />
                                    </div>
                                ))
                        )}
                    </List>
                </Paper>
                <UI.components.ActionBar>
                    <Create_or_add_user_dialog group_id={this.props.group_id} />
                </UI.components.ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group_id: ownProps.group_id,
        users: Users.selectors.get_users_by_group(state, ownProps.group_id),
        group: (group_id: string) =>
            Groups.selectors.select_group(state, group_id),
        selected_users: state.users.ui.selected_users
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(GroupUsersTab);
