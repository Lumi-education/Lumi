import * as React from 'react';
import { connect } from 'react-redux';
import * as shortid from 'shortid';

// types
import { Dispatch } from 'redux';
import { IState } from 'client/state';

// components
import { LoginContainer } from 'client/packages/auth';

// actions
import { push } from 'client/packages/ui/actions';
import { get_session, login, register } from 'client/packages/auth/actions';

interface IStateProps {
    is_authed: boolean;
    response: number;
    is_required: boolean;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class Auth extends React.Component<IProps, {}> {
    public request_id: string;

    constructor(props: IProps) {
        super(props);

        this.login = this.login.bind(this);
    }

    public login(username: string, password: string) {
        this.request_id = shortid();
        this.props.dispatch(login(username, password, this.request_id));
    }

    public componentWillMount() {
        this.props.dispatch(get_session());
    }

    public render() {
        if (this.props.is_authed) {
            return <div id="auth">{this.props.children}</div>;
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
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        is_authed: state.auth.is_authed,
        response: state.auth.response,
        is_required: state.auth.is_required
    };
}

function mapDispatchToProps(dispatch: Dispatch<{}>): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(Auth);
