import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import * as raven from 'raven-js';
import * as shortid from 'shortid';

// utils
import { state_color, random_bg } from 'lib/ui/utils';

// components
import { TextField, Paper, RaisedButton } from 'material-ui';

// modules
import * as Auth from '../';
import * as System from 'lib/system';

declare var window;

const log = debug('lumi:auth:container:login');

interface IState extends Auth.IState, System.IState {}

interface IStateProps {
    enable_guest_accounts: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    username?: string;
    password?: string;
    login_button_color?: string;
    username_error?: string;
    password_error?: string;
}

export class LoginContainer extends React.Component<IProps, IComponentState> {
    public password;
    constructor(props: IProps) {
        super(props);

        this.state = {
            username: '',
            password: '',
            login_button_color: 'white',
            username_error: '',
            password_error: ''
        };

        this.login = this.login.bind(this);
        this.guest_login = this.guest_login.bind(this);
    }

    public login() {
        this.setState({
            login_button_color: state_color('pending')
        });

        this.props
            .dispatch(
                Auth.actions.login(this.state.username, this.state.password)
            )
            .then(res => {
                log(res);
                switch (res.response.status) {
                    case 404:
                        this.setState({ username_error: 'username not found' });
                        this.setState({
                            login_button_color: state_color('error')
                        });
                        break;
                    case 401:
                        this.setState({ password_error: 'password incorrect' });
                        this.setState({
                            login_button_color: state_color('error')
                        });
                        break;
                    case 200:
                        this.setState({
                            login_button_color: state_color('success')
                        });
                        window.localStorage.jwt_token = res.payload.jwt_token;
                        this.props.dispatch(Auth.actions.get_session());
                        break;
                }
            });
    }

    public guest_login() {
        const username = 'guest_' + shortid();
        this.props
            .dispatch(Auth.actions.register(username, 'guest'))
            .then(r => {
                this.props
                    .dispatch(Auth.actions.login(username, 'guest'))
                    .then(re => {
                        window.localStorage.jwt_token = re.payload.jwt_token;

                        this.props.dispatch(Auth.actions.get_session());
                    });
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
                                hintText="Username"
                                type="text"
                                style={{ borderBottom: '1px solid #E4E8EB' }}
                                underlineShow={this.state.username_error !== ''}
                                errorText={this.state.username_error}
                                value={this.state.username}
                                onChange={(event, value) =>
                                    this.setState({
                                        username: value
                                            .replace(/\W+/g, '')
                                            .toLowerCase(),
                                        login_button_color: 'white',
                                        username_error: ''
                                    })
                                }
                                onKeyDown={e => {
                                    if (e.keyCode === 13) {
                                        this.password.focus();
                                    }
                                }}
                            />

                            <TextField
                                fullWidth={true}
                                underlineFocusStyle={{ borderColor: 'black' }}
                                inputStyle={{ fontWeight: 600 }}
                                hintText="Passwort"
                                underlineShow={this.state.password_error !== ''}
                                errorText={this.state.password_error}
                                ref={input => {
                                    this.password = input;
                                }}
                                type="password"
                                value={this.state.password}
                                onChange={(event, value) => {
                                    log(event);
                                    this.setState({
                                        password: value,
                                        login_button_color: 'white',
                                        password_error: ''
                                    });
                                }}
                                onKeyDown={e => {
                                    if (e.keyCode === 13) {
                                        this.login();
                                    }
                                }}
                            />
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
                                    label={'Login'}
                                    disabled={
                                        this.state.login_button_color !==
                                        'white'
                                    }
                                    style={{
                                        borderRadius: '6px'
                                    }}
                                    buttonStyle={{
                                        backgroundColor: this.state
                                            .login_button_color
                                    }}
                                    onClick={this.login}
                                />
                            </Paper>

                            {this.props.enable_guest_accounts ? (
                                <Paper zDepth={2}>
                                    <RaisedButton
                                        fullWidth={true}
                                        label={'GUEST'}
                                        style={{
                                            borderRadius: '6px'
                                        }}
                                        buttonStyle={{
                                            backgroundColor: this.state
                                                .login_button_color
                                        }}
                                        onClick={this.guest_login}
                                    />
                                </Paper>
                            ) : null}
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
        enable_guest_accounts: state.system.enable_guest_accounts
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
