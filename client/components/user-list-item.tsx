import * as React from 'react';

// components
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// modules
import * as Users from 'lib/users';

interface IPassedProps {
    user: Users.IUser;
    onClick: () => void;
}

interface IDispatchProps {}

interface IProps extends IPassedProps, IDispatchProps {}

interface IComponentState {}

export default class UserListItemComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <ListItem onClick={this.props.onClick}>
                <Avatar>{this.props.user.name.substring(0, 2)}</Avatar>
                <ListItemText primary={this.props.user.name} />
            </ListItem>
        );
    }
}
