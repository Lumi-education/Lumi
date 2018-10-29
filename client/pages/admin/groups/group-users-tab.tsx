// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { IState } from 'client/state';

// components
import { Avatar, Divider, List, ListItem, Paper } from 'material-ui';
import Typography from '@material-ui/core/Typography';

import { UserList } from 'client/components';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

import GroupsAssignDialog from 'client/dialogs/groups-assign-dialog';
import { push } from 'lib/ui/actions';

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
            <div
                style={{
                    paddingTop: '40px',
                    maxWidth: '680px',
                    margin: 'auto'
                }}
            >
                <Typography variant="h5" component="h3">
                    Benutzer
                </Typography>
                <Paper>
                    <UserList
                        users={this.props.users}
                        onListItemClick={(user_id: string) =>
                            this.props.dispatch(
                                push('/admin/users/' + user_id + '/analytics')
                            )
                        }
                    />
                </Paper>
                <UI.components.ActionBar>
                    <GroupsAssignDialog />
                </UI.components.ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group_id: ownProps.group_id,
        users: Users.selectors.users_in_group(state, ownProps.group_id),
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
