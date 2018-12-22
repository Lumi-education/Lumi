import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import raven from 'lib/core/raven';

// components
import { TextField, Paper, RaisedButton, LinearProgress } from 'material-ui';

// modules
import * as Core from 'lib/core';
import * as Auth from 'lib/auth';

import { IState } from 'client/state';

declare var window;

const log = debug('lumi:auth:container:login');

interface IComponentState {}

interface IStateProps {
    allow_user_registration: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    username?: string;
    password?: string;
    username_error?: string;
    password_error?: string;
    status?: number;
    checking_username?: boolean;
    username_exists?: boolean;
    login_disabled?: boolean;
    show_password_input?: boolean;
    login_button_style?: {
        backgroundColor: string;
    };
    login_button_text?: string;
}

export class LoginContainer extends React.Component<IProps, IComponentState> {
    public password;
    private username_timeout;
    constructor(props: IProps) {
        super(props);

        this.state = {
            username: '',
            password: '',
            username_error: '',
            password_error: '',
            status: 0,
            checking_username: false,
            username_exists: false,
            login_disabled: true,
            show_password_input: false,
            login_button_style: {
                backgroundColor: 'white'
            },
            login_button_text: Core.i18n.t('login')
        };

        this.login = this.login.bind(this);
        this._onChangeUsername = this._onChangeUsername.bind(this);
        this._checkUsername = this._checkUsername.bind(this);
    }

    public login() {
        if (this.state.username_exists) {
            this.props
                .dispatch(
                    Auth.actions.login(
                        this.state.username.toLowerCase(),
                        this.state.password
                    )
                )
                .then(res => {
                    log(res);
                    switch (res.response.status) {
                        case 404:
                            this.setState({
                                username_error: Core.i18n.t('not_found.user', {
                                    name: this.state.username
                                }),
                                status: 404
                            });
                            break;
                        case 401:
                            this.setState({
                                password_error: Core.i18n.t(
                                    'password_incorrect'
                                ),
                                status: 401
                            });
                            break;
                        case 200:
                            this.setState({
                                status: 200
                            });
                            window.localStorage.jwt_token =
                                res.payload.jwt_token;
                            this.props.dispatch(Auth.actions.get_session());
                            break;
                    }
                });
        } else {
            if (this.props.allow_user_registration) {
                this.setState({
                    login_button_text: Core.i18n.t('creating')
                });
                this.props
                    .dispatch(
                        Auth.actions.register(
                            this.state.username.toLowerCase(),
                            'test'
                        )
                    )
                    .then(res => {
                        this.setState({
                            login_button_text: Core.i18n.t('logging_in') + '...'
                        });
                        this.props
                            .dispatch(
                                Auth.actions.login(
                                    this.state.username.toLowerCase(),
                                    'test'
                                )
                            )
                            .then(login_response => {
                                if (login_response.response.status === 200) {
                                    this.setState({
                                        status: 200
                                    });
                                    window.localStorage.jwt_token =
                                        login_response.payload.jwt_token;
                                    this.props.dispatch(
                                        Auth.actions.get_session()
                                    );
                                }
                            });
                    });
            }
        }
    }

    public _checkUsername() {
        this.props
            .dispatch(Auth.actions.check_username(this.state.username))
            .then(res => {
                if (this.props.allow_user_registration) {
                    switch (res.response.status) {
                        case 404:
                            return this.setState({
                                username_error: Core.i18n.t('username_free', {
                                    name: this.state.username
                                }),
                                username_exists: false,
                                login_disabled: false,

                                checking_username: false
                            });

                        default:
                            return this.setState({
                                username_error: Core.i18n.t('username_exists'),
                                login_disabled: true,
                                username_exists: true,

                                checking_username: false,
                                show_password_input: true
                            });
                    }
                }
                switch (res.response.status) {
                    case 404:
                        return this.setState({
                            username_error: Core.i18n.t(
                                'username_does_not_exist',
                                { name: this.state.username }
                            ),
                            login_disabled: true,
                            username_exists: false,

                            checking_username: false
                        });

                    default:
                        return this.setState({
                            username_error: undefined,
                            login_disabled: false,
                            username_exists: true,

                            checking_username: false,
                            show_password_input: true
                        });
                }
            });
    }

    public _onChangeUsername(event, value) {
        clearTimeout(this.username_timeout);
        this.username_timeout = setTimeout(this._checkUsername, 1000);
        this.setState({
            username: value.replace(/[^a-z0-9]/gi, ''),
            login_button_style: {
                backgroundColor: 'white'
            },
            checking_username: true,
            username_error: '',
            show_password_input: false
        });
    }

    public render() {
        try {
            return (
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                    className="bg"
                >
                    <div>
                        <Paper
                            style={{
                                margin: 'auto',
                                padding: '2px 5px 2px 5px',
                                maxWidth: '400px',
                                borderRadius: '6px'
                            }}
                            zDepth={2}
                        >
                            <TextField
                                fullWidth={true}
                                underlineFocusStyle={{ borderColor: 'black' }}
                                inputStyle={{ fontWeight: 600 }}
                                hintText={Core.i18n.t('name')}
                                type="text"
                                style={{ borderBottom: '1px solid #E4E8EB' }}
                                underlineShow={this.state.username_error !== ''}
                                errorText={this.state.username_error}
                                value={this.state.username}
                                onChange={this._onChangeUsername}
                                onKeyDown={e => {
                                    if (e.keyCode === 13) {
                                        this.password.focus();
                                    }
                                }}
                            />
                            {this.state.checking_username ? (
                                <LinearProgress mode="indeterminate" />
                            ) : null}
                            {this.state.show_password_input ? (
                                <TextField
                                    fullWidth={true}
                                    underlineFocusStyle={{
                                        borderColor: 'black'
                                    }}
                                    inputStyle={{ fontWeight: 600 }}
                                    hintText={Core.i18n.t('password')}
                                    underlineShow={
                                        this.state.password_error !== ''
                                    }
                                    errorText={this.state.password_error}
                                    ref={input => {
                                        this.password = input;
                                    }}
                                    type="password"
                                    value={this.state.password}
                                    onChange={(event, value) => {
                                        this.setState({
                                            password: value,
                                            login_button_style: {
                                                backgroundColor: 'white'
                                            },
                                            password_error: '',
                                            login_disabled: false
                                        });
                                    }}
                                    onKeyDown={e => {
                                        if (e.keyCode === 13) {
                                            this.login();
                                        }
                                    }}
                                />
                            ) : null}
                        </Paper>
                        <div
                            style={{
                                margin: 'auto',
                                marginTop: '20px',
                                maxWidth: '400px',
                                borderRadius: '6px'
                            }}
                        >
                            <Paper zDepth={2}>
                                <RaisedButton
                                    fullWidth={true}
                                    label={this.state.login_button_text}
                                    disabled={this.state.login_disabled}
                                    style={{
                                        borderRadius: '6px'
                                    }}
                                    buttonStyle={this.state.login_button_style}
                                    onClick={this.login}
                                />
                            </Paper>
                        </div>
                    </div>
                </div>
            );
        } catch (err) {
            raven.captureException(err);
        }
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        allow_user_registration: state.core.system.allow_user_registration
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer);
