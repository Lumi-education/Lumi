// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { IState } from 'client/state';

// components
import Avatar from 'client/components/avatar';
import { Paper } from 'material-ui';
import Typography from '@material-ui/core/Typography';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

// icons
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

import GroupsAssignDialog from 'client/dialogs/groups-assign-dialog';
import CreateUserDialog from 'client/dialogs/user-create-dialog';

import { push } from 'lib/ui/actions';

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    users: Users.IUser[];
    group: Groups.IGroup;
    selected_users: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_remove_user_dialog: boolean;
    user_to_remove: Users.models.User;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupUsersTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_remove_user_dialog: false,
            user_to_remove: null
        };

        this.remove_user = this.remove_user.bind(this);
    }

    public remove_user() {
        this.props.dispatch(
            Groups.actions.remove_users_from_groups(
                this.state.user_to_remove,
                this.props.group
            )
        );
        this.setState({ user_to_remove: null, show_remove_user_dialog: false });
    }

    public render() {
        const { users, group } = this.props;
        return (
            <div
                style={{
                    paddingTop: '40px',
                    maxWidth: '680px',
                    margin: 'auto'
                }}
            >
                <Typography variant="h5" component="h3">
                    {Core.i18n.t('users')}
                </Typography>
                <Paper>
                    <List component="nav">
                        {users.map(user => (
                            <ListItem
                                onClick={() =>
                                    this.props.dispatch(
                                        UI.actions.push(
                                            '/admin/users/' + user._id
                                        )
                                    )
                                }
                            >
                                <Avatar doc={user}>
                                    <PersonIcon />
                                </Avatar>
                                <ListItemText
                                    primary={user.name}
                                    secondary={
                                        user.flow.length +
                                        ' ' +
                                        Core.i18n.t('assignments')
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        onClick={() =>
                                            this.setState({
                                                user_to_remove: user,
                                                show_remove_user_dialog: true
                                            })
                                        }
                                        aria-label="Delete"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
                <UI.components.ActionBar>
                    <FloatingActionButton
                        onClick={() => {
                            this.props.dispatch(
                                UI.actions.toggle_create_user_dialog()
                            );
                        }}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </UI.components.ActionBar>
                <Dialog open={this.state.show_remove_user_dialog}>
                    <DialogContent>
                        {Core.i18n.t('remove_user_from_group_confirmation', {
                            user:
                                this.state.user_to_remove === null
                                    ? ''
                                    : this.state.user_to_remove.name,
                            group: this.props.group.name
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() =>
                                this.setState({
                                    user_to_remove: null,
                                    show_remove_user_dialog: false
                                })
                            }
                            color="primary"
                        >
                            {Core.i18n.t('cancel')}
                        </Button>
                        <Button onClick={this.remove_user} color="primary">
                            {Core.i18n.t('ok')}
                        </Button>
                    </DialogActions>
                </Dialog>
                <CreateUserDialog
                    user_options={{ groups: [this.props.group_id] }}
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const group_id = ownProps.group_id;
    return {
        group_id,
        users: Users.selectors.users_in_group(state, ownProps.group_id),
        group: Groups.selectors.select_group(state, group_id),
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
