// modules
import * as React from 'react';
import * as debug from 'debug';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import styles from 'client/style/style';

// actions
import { IState } from '../state';
import * as Core from 'lib/core';
import * as Users from 'lib/users';

const log_info = debug('lumi:info:components:user-create');
const log_error = debug('lumi:error:components:user-create');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    existing_usernames: string[];
    classes: any;
    users_to_create: string[];
    username: string;
    error: {
        message: string;
    };
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

export class CreateUserContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            username: ''
        };

        this.change_username = this.change_username.bind(this);
        this.add_username = this.add_username.bind(this);
        this.remove_username = this.remove_username.bind(this);
        this.key_down = this.key_down.bind(this);
    }

    public change_username(e) {
        this.props.dispatch(
            Users.actions.set_username_to_create(e.target.value)
        );
    }

    public add_username() {
        log_info('add_username', this.props.username);
        this.props.dispatch(
            Users.actions.add_user_to_create(
                this.props.username,
                this.props.existing_usernames
            )
        );
    }

    public remove_username(username: string) {
        log_info('remove_username', username);
        this.props.dispatch(Users.actions.remove_user_from_create(username));
    }

    public key_down(e) {
        if (e.keyCode === 13) {
            this.add_username();
        }
    }

    public render() {
        const { classes } = this.props;
        return (
            <div id="user-create-container">
                <List>
                    {this.props.users_to_create.map(username => (
                        <ListItem key={username}>
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                            <ListItemText>{username}</ListItemText>
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() =>
                                        this.remove_username(username)
                                    }
                                    aria-label="Delete"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                <Typography color="error">
                    {Core.i18n.t(this.props.error.message)}
                </Typography>

                <TextField
                    autoFocus={true}
                    margin="dense"
                    id="name"
                    label={Core.i18n.t('name')}
                    type="text"
                    fullWidth={true}
                    value={this.props.username}
                    onChange={this.change_username}
                    onKeyDown={this.key_down}
                />
                <Button
                    onClick={this.add_username}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    fullWidth={true}
                >
                    {Core.i18n.t('add')}
                </Button>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        existing_usernames: [
            ...state.users.list.map(user => user.name),
            ...state.users.ui.users_to_create
        ],
        users_to_create: state.users.ui.users_to_create,
        classes: ownProps.classes,
        username: state.users.ui.username_to_create,
        error: state.users.ui.error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(CreateUserContainer)
);
