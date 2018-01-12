import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// utils
import { state_color } from 'lib/ui/utils';

// types
import { Dispatch } from 'redux';
import { IState } from 'client/state';

// components
import LoginComponent from 'lib/auth/components/login';
import { PasswordDialogComponent } from '../';

// actions
import { push } from 'lib/ui/actions';
import { check_username, login, set_password } from 'lib/auth/actions';

const log = debug('lumi:auth:container:login');

interface IStateProps {
    username: string;
    username_request: 'init' | 'pending' | 'success' | 'error';
    login_request: 'init' | 'pending' | 'success' | 'error';
    username_pw_is_set: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    username_error_text?: string;
    password_error_text?: string;
    password?: string;
    display_pw_dialog?: boolean;
}

export class LoginContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            username_error_text: '',
            password: '',
            display_pw_dialog: false,
            password_error_text: ''
        };

        this.set_username = this.set_username.bind(this);
        this.set_password = this.set_password.bind(this);
        this.button_state = this.button_state.bind(this);
        this.handle_login = this.handle_login.bind(this);
    }

    public set_username(username: string) {
        this.setState({
            username_error_text: 'checking username ' + username + '...'
        });
        this.props.dispatch(check_username(username)).then(res => {
            if (res.response.status === 200) {
                this.setState({
                    username_error_text: username + ' exists'
                });
            } else {
                this.setState({
                    username_error_text: username + ' does not exist'
                });
            }
        });
    }

    public button_state():
        | 'disabled'
        | 'init'
        | 'pending'
        | 'success'
        | 'error' {
        if (this.props.username_request !== 'success') {
            return 'disabled';
        }

        if (this.props.username_pw_is_set && this.state.password === '') {
            return 'disabled';
        }

        return this.props.login_request;
    }

    public handle_login() {
        if (this.props.login_request === 'pending') {
            return;
        }

        if (this.props.username_pw_is_set) {
            this.props.dispatch(
                login(this.props.username, this.state.password)
            );
        } else {
            this.setState({ display_pw_dialog: true });
        }
    }

    public set_password(password: string) {
        this.props
            .dispatch(set_password(this.props.username, password))
            .then(res => {
                this.props.dispatch(login(this.props.username, password));
            });
    }

    public render() {
        return (
            <div>
                <LoginComponent
                    username={this.props.username}
                    set_username={username => this.set_username(username)}
                    password={this.state.password}
                    set_password={(pw: string) =>
                        this.setState({ password: pw })
                    }
                    show_password_input={this.props.username_pw_is_set}
                    button_disabled={this.button_state() === 'disabled'}
                    button_label={'Log in'}
                    button_color={state_color(this.button_state())}
                    username_error_text={this.state.username_error_text}
                    username_error_style={{
                        color: state_color(this.props.username_request)
                    }}
                    password_error_text={
                        this.props.login_request === 'error'
                            ? 'password incorrect'
                            : null
                    }
                    password_error_style={{}}
                    login={this.handle_login}
                />
                <PasswordDialogComponent
                    onRequestClose={() =>
                        this.setState({ display_pw_dialog: false })
                    }
                    open={this.state.display_pw_dialog}
                    change_password={this.set_password}
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        username: state.auth.username,
        username_request: state.auth.username_request,
        username_pw_is_set: state.auth.username_pw_is_set,
        login_request: state.auth.login_request
    };
}

function mapDispatchToProps(dispatch: Dispatch<{}>): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer);
