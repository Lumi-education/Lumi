// modules
import * as React from 'react';

// material-ui
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import { state_color } from 'client/style/utils';

interface IStateProps {
    response: number;
}

interface IDispatchProps {
    register: (username: string, password: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {
    password?: string;
    password_repeat?: string;
    username?: string;
}

export default class AuthRegisterComponent extends React.Component<
    IProps,
    IState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            password: '',
            password_repeat: '',
            username: ''
        };

        this.handle_password_input = this.handle_password_input.bind(this);
        this.handle_username_input = this.handle_username_input.bind(this);
        this.handle_password_repeat_input = this.handle_password_repeat_input.bind(
            this
        );
    }

    public handle_password_input(e) {
        this.setState({ password: e.target.value });
    }

    public handle_password_repeat_input(e) {
        this.setState({ password_repeat: e.target.value });
    }

    public handle_username_input(e, t) {
        const username = t.toLocaleLowerCase().replace(/\s/g, '');
        this.setState({ username });
    }

    public render() {
        return (
            <div>
                <div className="app-content">
                    <Paper
                        style={{ padding: '20px', margin: '10px' }}
                        zDepth={1}
                    >
                        <h1>Register</h1>
                        <TextField
                            fullWidth={true}
                            hintText="Username"
                            type="text"
                            errorText={
                                this.props.response === 409
                                    ? 'Username already exists.'
                                    : null
                            }
                            value={this.state.username}
                            onChange={this.handle_username_input}
                        />
                        <TextField
                            fullWidth={true}
                            hintText="Password"
                            floatingLabelText="Password"
                            errorText={
                                this.props.response === 401
                                    ? 'Password incorrect.'
                                    : null
                            }
                            type="password"
                            value={this.state.password}
                            onChange={this.handle_password_input}
                        />
                        <TextField
                            fullWidth={true}
                            hintText="Repeat password"
                            floatingLabelText="Repeat password"
                            errorText={
                                this.state.password !==
                                this.state.password_repeat
                                    ? 'Passwords not identical.'
                                    : null
                            }
                            type="password"
                            value={this.state.password_repeat}
                            onChange={this.handle_password_repeat_input}
                        />
                        <RaisedButton
                            fullWidth={true}
                            disabled={
                                this.state.username === '' ||
                                this.state.password !==
                                    this.state.password_repeat
                            }
                            label="Register"
                            buttonStyle={{
                                backgroundColor: state_color('init')
                            }}
                            onClick={() => {
                                this.props.register(
                                    this.state.username,
                                    this.state.password
                                );
                            }}
                            style={{ marginTop: '20px' }}
                        />
                    </Paper>
                </div>
                <Snackbar
                    open={this.props.response >= 500}
                    message={'Error: ' + this.props.response}
                    autoHideDuration={60000}
                />
            </div>
        );
    }
}
