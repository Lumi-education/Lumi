import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import raven from 'lib/core/raven';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// components
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';

import CheckIcon from '@material-ui/icons/Check';

// modules
import * as Core from 'lib/core';
import * as Auth from '..';

const log_info = debug('lumi:auth:container:login');

interface IComponentState {}

interface IStateProps {
    username: string;

    error_message: string;
    username_validated: boolean;
    password: string;
    // email: {
    //     email: string;
    //     validated: boolean;
    // };

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    password_repeat: string;
}

const styles: StyleRulesCallback = theme => ({
    form: {
        width: '100%',
        marginTop: theme.spacing.unit
    }
});

export class AuthRegisterFormContainer extends React.Component<
    IProps,
    IComponentState
> {
    private username_timeout;

    constructor(props: IProps) {
        super(props);

        this.state = {
            password_repeat: ''
        };

        this.change_username = this.change_username.bind(this);
        this.change_password = this.change_password.bind(this);
        this.change_email = this.change_email.bind(this);
        this.passwords_match = this.passwords_match.bind(this);
    }

    public change_username(event) {
        const username = event.target.value;
        this.props.dispatch(Auth.actions.set_username(username));

        clearTimeout(this.username_timeout);
        this.username_timeout = setTimeout(
            () => this.props.dispatch(Auth.actions.check_username(username)),
            1000
        );
    }

    public change_password(event) {
        this.props.dispatch(Auth.actions.set_password(event.target.value));
        this.props.dispatch(Auth.actions.reset_error());
    }

    public change_email(event) {
        const email = event.target.value;

        this.props.dispatch(Auth.actions.set_email(email));
    }

    public passwords_match(): boolean {
        return (
            this.props.password === this.state.password_repeat &&
            this.props.password !== '' &&
            this.state.password_repeat !== ''
        );
    }

    public render() {
        const { classes } = this.props;

        try {
            return (
                <div>
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
                            endAdornment={
                                this.props.username_validated ? (
                                    <InputAdornment
                                        variant="filled"
                                        position="end"
                                    >
                                        <CheckIcon />
                                    </InputAdornment>
                                ) : null
                            }
                            error={
                                this.props.error_message ===
                                'auth.username_exists'
                            }
                        />
                        {this.props.error_message === 'auth.username_exists' ? (
                            <FormHelperText className={classes.error_text}>
                                {Core.i18n.t(this.props.error_message)}
                            </FormHelperText>
                        ) : null}
                    </FormControl>
                    {/* <FormControl
                        margin="normal"
                        required={true}
                        fullWidth={true}
                    >
                        <InputLabel htmlFor="email">
                            {Core.i18n.t('auth.email')}
                        </InputLabel>
                        <Input
                            id="email"
                            endAdornment={
                                this.props.email.validated ? (
                                    <InputAdornment
                                        variant="filled"
                                        position="end"
                                    >
                                        <CheckIcon />
                                    </InputAdornment>
                                ) : null
                            }
                            name="email"
                            autoComplete="email"
                            value={this.props.email.email}
                            onChange={this.change_email}
                            error={
                                this.props.error_message ===
                                'auth.user_not_found'
                            }
                        />
                        {this.props.error_message === 'auth.user_not_found' ? (
                            <FormHelperText className={classes.error_text}>
                                {Core.i18n.t(this.props.error_message)}
                            </FormHelperText>
                        ) : null}
                    </FormControl> */}
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
                            value={this.props.password}
                            onChange={this.change_password}
                            endAdornment={
                                this.passwords_match() ? (
                                    <InputAdornment
                                        variant="filled"
                                        position="end"
                                    >
                                        <CheckIcon />
                                    </InputAdornment>
                                ) : null
                            }
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
                    <FormControl
                        margin="normal"
                        required={true}
                        fullWidth={true}
                    >
                        <InputLabel htmlFor="password_repeat">
                            {Core.i18n.t('auth.password_repeat')}
                        </InputLabel>
                        <Input
                            name="password"
                            type="password"
                            id="password_repeat"
                            autoComplete="current-password"
                            value={this.state.password_repeat}
                            onChange={e =>
                                this.setState({
                                    password_repeat: e.target.value
                                })
                            }
                            endAdornment={
                                this.passwords_match() ? (
                                    <InputAdornment
                                        variant="filled"
                                        position="end"
                                    >
                                        <CheckIcon />
                                    </InputAdornment>
                                ) : null
                            }
                            error={!this.passwords_match()}
                        />
                        {!this.passwords_match() ? (
                            <FormHelperText className={classes.error_text}>
                                {Core.i18n.t('auth.passwords_do_not_match')}
                            </FormHelperText>
                        ) : null}
                    </FormControl>
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
        password: state.auth.password,
        // login_state: state.auth.login_state,
        // allow_user_registration: true,
        error_message: state.auth.error_message,
        // email: state.auth.email,
        classes: ownProps.classes,
        username_validated: state.auth.username_validated
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
    )(AuthRegisterFormContainer)
);
