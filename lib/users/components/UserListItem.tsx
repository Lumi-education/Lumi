import * as React from 'react';
import { connect } from 'react-redux';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// components
import Avatar from 'lib/core/components/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import PersonIcon from '@material-ui/icons/Person';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

// modules
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

interface IPassedProps {
    user: Users.models.User;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IStateProps {
    selected_user_ids: string[];
    classes: any;
}

interface IProps extends IPassedProps, IDispatchProps, IStateProps {}

interface IComponentState {}

export class UserListItemComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const { user } = this.props;
        return (
            <ListItem
                onClick={() =>
                    this.props.dispatch(
                        UI.actions.push('/admin/users/' + user._id)
                    )
                }
            >
                <Avatar doc={user}>
                    <PersonIcon />
                </Avatar>
                <ListItemText primary={user.name} />
                <ListItemSecondaryAction>
                    <Checkbox
                        onChange={() =>
                            this.props.dispatch(
                                Users.actions.select_user(user._id)
                            )
                        }
                        checked={
                            this.props.selected_user_ids.indexOf(user._id) > -1
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

function mapStateToProps(state: Users.types.IState, ownProps): IStateProps {
    return {
        selected_user_ids: state.users.ui.selected_users,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UserListItemComponent)
);
