import * as React from 'react';
import { connect } from 'react-redux';
import * as shortid from 'shortid';

// types
import { Dispatch } from 'redux';
import { IState } from 'client/state';

// components
import { Tabs, Tab } from 'material-ui/Tabs';
import Login from 'client/components/login';
import Register from 'client/components/register';

// actions
import { push } from 'react-router-redux';
import { get_session, login, register } from 'client/state/auth/actions';

interface IStateProps {
    is_authed: boolean;
    response: number;
    request: {};
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
        } else {
            return (
                <Tabs
                    tabItemContainerStyle={{
                        background: 'linear-gradient(120deg, #8e44ad, #3498db)'
                    }}
                >
                    <Tab label="Login">
                        <Login
                            login={this.login}
                            request={this.props.request[this.request_id]}
                            response={this.props.response}
                        />
                    </Tab>
                    <Tab label="Register">
                        <Register
                            register={(username: string, password: string) =>
                                this.props.dispatch(
                                    register(username, password)
                                )
                            }
                            request={this.props.request[this.request_id]}
                            response={this.props.response}
                        />
                    </Tab>
                </Tabs>
            );
        }
    }
}
function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        is_authed: state.auth.is_authed,
        response: state.auth.response,
        request: state.request
    };
}

function mapDispatchToProps(dispatch: Dispatch<{}>): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(Auth);
