import * as React from 'react';
import { connect } from 'react-redux';
import raven from 'lib/core/raven';

// components
import { Dialog, TextField, RaisedButton } from 'material-ui';

import * as Core from 'lib/core';
import * as Auth from 'lib/auth';

interface IStateProps {
    username: string;
    password: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    password?: string;
    password_repeat?: string;
}

export class PasswordContainer extends React.Component<
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
        try {
            return (
                <Dialog
                    title={Core.i18n.t('set_your_password')}
                    open={!this.props.password}
                >
                    <TextField
                        fullWidth={true}
                        hintText={Core.i18n.t('password')}
                        floatingLabelText={Core.i18n.t('password')}
                        type="password"
                        value={this.state.password}
                        onChange={(event, value) =>
                            this.setState({ password: value })
                        }
                    />
                    <TextField
                        fullWidth={true}
                        hintText={Core.i18n.t('repeat_password')}
                        floatingLabelText={Core.i18n.t('repeat_password')}
                        type="password"
                        value={this.state.password_repeat}
                        errorText={
                            this.validate_password().type === 'pw_not_matching'
                                ? Core.i18n.t('passwords_do_not_match')
                                : null
                        }
                        onChange={(event, value) =>
                            this.setState({ password_repeat: value })
                        }
                    />
                    <RaisedButton
                        fullWidth={true}
                        disabled={
                            !(this.validate_password().state === 'success')
                        }
                        label={Core.i18n.t('continue')}
                        onClick={() =>
                            this.props.dispatch(
                                Auth.actions.set_password(
                                    this.props.username,
                                    this.state.password
                                )
                            )
                        }
                        style={{ marginTop: '20px' }}
                    />
                </Dialog>
            );
        } catch (err) {
            raven.captureException(err);
        }
    }
}

function mapStateToProps(state: Auth.IState, ownProps: {}): IStateProps {
    return {
        username: state.auth.username,
        password: state.auth.password
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(PasswordContainer);
