import * as React from 'react';
// components
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from 'client/components/avatar';
import PersonIcon from '@material-ui/icons/Person';
// modules
import * as Users from 'lib/users';
import * as Core from 'lib/core';

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
                <Avatar doc={this.props.user}>
                    <PersonIcon />
                </Avatar>
                <ListItemText
                    primary={this.props.user.name}
                    secondary={
                        this.props.user.flow.length +
                        ' ' +
                        Core.i18n.t('assignments')
                    }
                />
            </ListItem>
        );
    }
}
