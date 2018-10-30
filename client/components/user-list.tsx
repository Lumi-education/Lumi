import * as React from 'react';

// components
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import UserListItem from './user-list-item';

// modules
import * as Core from 'lib/core';
import * as Users from 'lib/users';

interface IPassedProps {
    users: Users.IUser[];
}

interface IDispatchProps {
    onListItemClick: (user_id: string) => void;
}

interface IProps extends IPassedProps, IDispatchProps {}

interface IComponentState {}

export default class UserListComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (this.props.users.length === 0) {
            return (
                <Paper>
                    <Typography variant="h5" component="h3">
                        {Core.i18n.t('not_found.users')}
                    </Typography>
                </Paper>
            );
        }
        return (
            <List component="nav">
                {this.props.users.map(user => (
                    <div>
                        <UserListItem
                            user={user}
                            onClick={() => this.props.onListItemClick(user._id)}
                        />
                        <Divider />
                    </div>
                ))}
            </List>
        );
    }
}
