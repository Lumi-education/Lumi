import * as React from 'react';
import { connect } from 'react-redux';
import * as raven from 'raven-js';
import * as debug from 'debug';
// types
import { Dispatch } from 'redux';
import { IState } from 'client/state';

// components
import { LoginContainer, PasswordDialogComponent } from 'lib/auth';

// actions
import { push } from 'lib/ui/actions';
import { get_session, login, register, set_password } from 'lib/auth/actions';

const log = debug('lumi:auth');

interface IStateProps {
    is_authed: boolean;
    response: number;
    is_required: boolean;
    pw: string;
    username: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class Auth extends React.Component<IProps, {}> {
    public request_id: string;

    constructor(props: IProps) {
        super(props);

        this.login = this.login.bind(this);
        this.set_password = this.set_password.bind(this);
    }

    public login(username: string, password: string) {
        this.props.dispatch(login(username, password));
    }

    public componentWillMount() {
        this.props.dispatch(get_session());
    }

    public set_password(password: string) {
        this.props
            .dispatch(set_password(this.props.username, password))
            .then(res => {
                this.props.dispatch(login(this.props.username, password));
            });
    }

    public render() {
        try {
            if (this.props.is_authed) {
                return (
                    <div id="auth">
                        {this.props.children}
                        <PasswordDialogComponent
                            onRequestClose={() => log('err')}
                            open={!this.props.pw}
                            change_password={this.set_password}
                        />
                    </div>
                );
            }

            if (!this.props.is_required) {
                return <div id="auth">{this.props.children}</div>;
            }

            return (
                <div
                    style={{
                        background: 'linear-gradient(230deg, #4b79cf, #4bc5cf)',
                        width: '100%',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <div>
                        <LoginContainer />
                    </div>
                </div>
            );
        } catch (err) {
            raven.captureException(err);
            raven.showReportDialog();
        }
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        is_authed: state.auth.is_authed,
        response: state.auth.response,
        is_required: state.auth.is_required,
        pw: state.users.me.password,
        username: state.users.me.name
    };
}

function mapDispatchToProps(dispatch: Dispatch<{}>): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(Auth);
