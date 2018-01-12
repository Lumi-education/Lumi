// modules
import * as React from 'react';

// material-ui
import { Dialog, TextField, RaisedButton } from 'material-ui';

import { state_color } from 'lib/ui/utils';

interface IStateProps {
    open: boolean;
}

interface IDispatchProps {
    change_password: (password: string) => void;
    onRequestClose: () => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    password?: string;
    password_repeat?: string;
}

export default class AuthPasswordDialogComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            password: '',
            password_repeat: ''
        };

        this.validate_password = this.validate_password.bind(this);
    }

    public validate_password(): {
        state: 'init' | 'pending' | 'success' | 'error' | 'disabled';
        type: 'pw_empty' | 'pw_not_matching' | 'pw_set';
    } {
        if (this.state.password === '' || this.state.password_repeat === '') {
            return {
                state: 'init',
                type: 'pw_empty'
            };
        }
        if (this.state.password !== this.state.password_repeat) {
            return {
                state: 'error',
                type: 'pw_not_matching'
            };
        }

        return {
            state: 'success',
            type: 'pw_set'
        };
    }

    public render() {
        return (
            <Dialog
                onRequestClose={this.props.onRequestClose}
                title="Set your password"
                open={this.props.open}
            >
                <TextField
                    fullWidth={true}
                    hintText="Passwort"
                    floatingLabelText="Passwort"
                    type="password"
                    value={this.state.password}
                    onChange={(event, value) =>
                        this.setState({ password: value })
                    }
                />
                <TextField
                    fullWidth={true}
                    hintText="Repeat Passwort"
                    floatingLabelText="Repeat Passwort"
                    type="password"
                    value={this.state.password_repeat}
                    errorText={
                        this.validate_password().type === 'pw_not_matching'
                            ? 'Password does not match'
                            : null
                    }
                    onChange={(event, value) =>
                        this.setState({ password_repeat: value })
                    }
                />
                <RaisedButton
                    fullWidth={true}
                    disabled={!(this.validate_password().state === 'success')}
                    label="Continue"
                    buttonStyle={{
                        backgroundColor: state_color(
                            this.validate_password().state === 'success'
                                ? 'init'
                                : 'disabled'
                        )
                    }}
                    onClick={() =>
                        this.props.change_password(this.state.password)
                    }
                    style={{ marginTop: '20px' }}
                />
            </Dialog>
        );
    }
}