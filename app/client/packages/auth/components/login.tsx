// modules
import * as React from 'react';

// material-ui
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

interface IStateProps {
    username: string;
    password: string;
    show_password_input: boolean;

    button_disabled: boolean;
    button_label: string;
    button_color: string;

    username_error_text: string;
    username_error_style;

    password_error_text: string;
    password_error_style;
}

interface IDispatchProps {
    login: () => void;
    set_username: (username: string) => void;
    set_password: (password: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class AuthLoginComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Paper style={{ padding: '20px' }} zDepth={1}>
                    <TextField
                        fullWidth={true}
                        hintText="Username"
                        type="text"
                        errorText={this.props.username_error_text}
                        errorStyle={this.props.username_error_style}
                        value={this.props.username}
                        onChange={(event, value) =>
                            this.props.set_username(value)
                        }
                    />
                    {this.props.show_password_input ? (
                        <TextField
                            fullWidth={true}
                            hintText="Passwort"
                            floatingLabelText="Passwort"
                            errorText={this.props.password_error_text}
                            errorStyle={this.props.password_error_style}
                            type="password"
                            value={this.props.password}
                            onChange={(event, value) =>
                                this.props.set_password(value)
                            }
                        />
                    ) : null}
                    <RaisedButton
                        fullWidth={true}
                        disabled={this.props.button_disabled}
                        label={this.props.button_label}
                        buttonStyle={{
                            backgroundColor: this.props.button_color
                        }}
                        onClick={this.props.login}
                        style={{ marginTop: '20px' }}
                    />
                </Paper>
            </div>
        );
    }
}
