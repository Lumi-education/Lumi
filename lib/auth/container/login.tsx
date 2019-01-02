import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import raven from 'lib/core/raven';
import * as classnames from 'classnames';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// components
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';

import Logo from '../components/logo';
// modules
import * as Core from 'lib/core';
import * as Auth from '../';

const log_info = debug('lumi:auth:container:login');

interface IComponentState {}

interface IStateProps {
    username: string;

    login_state: 'init' | 'pending' | 'success' | 'error';
    error_message: string;
    allow_user_registration: boolean;

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    password: string;
}

const styles: StyleRulesCallback = theme => ({
    paper: {
        margin: 'auto',
        maxWidth: '400px'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit
    },
    login_button: {
        marginTop: theme.spacing.unit * 3
    },
    error_bg: {
        backgroundColor: theme.palette.error.main
    },
    error_text: {
        color: theme.palette.error.main
    },
    pending: {
        backgroundColor: theme.palette.secondary.main
    }
});

export class LoginContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            password: ''
        };

        this.change_username = this.change_username.bind(this);
        this.change_password = this.change_password.bind(this);
        this.login = this.login.bind(this);
    }

    public change_username(event) {
        this.props.dispatch(Auth.actions.set_username(event.target.value));
    }

    public change_password(event) {
        this.setState({ password: event.target.value });
        this.props.dispatch(Auth.actions.reset_error());
    }

    public login() {
        log_info('login');
        this.props.dispatch(
            Auth.actions.login(this.props.username, this.state.password)
        );
    }

    public render() {
        const { classes } = this.props;

        try {
            return (
                <div>
                    <Paper className={classes.paper}>
                        <FormControl
                            margin="normal"
                            required={true}
                            fullWidth={true}
                        >
                            <InputLabel htmlFor="username">
                                {Core.i18n.t('auth.username')}
                            </InputLabel>
                            <Input
                                id="username"
                                name="username"
                                autoComplete="username"
                                autoFocus={true}
                                value={this.props.username}
                                onChange={this.change_username}
                                error={
                                    this.props.error_message ===
                                    'auth.user_not_found'
                                }
                            />
                            {this.props.error_message ===
                            'auth.user_not_found' ? (
                                <FormHelperText className={classes.error_text}>
                                    {Core.i18n.t(this.props.error_message)}
                                </FormHelperText>
                            ) : null}
                        </FormControl>
                    </Paper>
                    <Paper className={classes.paper}>
                        <FormControl
                            margin="normal"
                            required={true}
                            fullWidth={true}
                        >
                            <InputLabel htmlFor="password">
                                {Core.i18n.t('auth.password')}
                            </InputLabel>
                            <Input
                                name="password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={this.state.password}
                                onChange={this.change_password}
                                error={
                                    this.props.error_message ===
                                    'auth.invalid_password'
                                }
                            />
                            {this.props.error_message ===
                            'auth.invalid_password' ? (
                                <FormHelperText className={classes.error_text}>
                                    {Core.i18n.t(this.props.error_message)}
                                </FormHelperText>
                            ) : null}
                        </FormControl>
                    </Paper>
                    <Button
                        type="submit"
                        fullWidth={true}
                        variant="contained"
                        className={classnames(classes.login_button, {
                            [classes.error_bg]:
                                this.props.login_state === 'error',
                            [classes.success]:
                                this.props.login_state === 'success',
                            [classes.pending]:
                                this.props.login_state === 'pending'
                        })}
                        onClick={this.login}
                        disabled={
                            this.props.username === '' ||
                            this.state.password === ''
                        }
                    >
                        {Core.i18n.t('auth.login')}
                    </Button>
                </div>
            );
        } catch (err) {
            raven.captureException(err);
        }
    }
}

function mapStateToProps(state: Auth.types.IState, ownProps): IStateProps {
    return {
        username: state.auth.username,
        login_state: state.auth.login_state,
        allow_user_registration: true,
        error_message: state.auth.error_message,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(LoginContainer)
);
