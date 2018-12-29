import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import raven from 'lib/core/raven';
import * as debug from 'debug';

// local
import * as Auth from 'lib/auth';

import Password from './password';
import Login from './login';
import Landing from './landing';

import Admin from './admin';
import User from './user';

const log = debug('lumi:client:pages:auth');

interface IStateProps {
    user_id: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AuthContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        log('componentWillMount');
        this.props.dispatch(Auth.actions.get_session());
    }

    public render() {
        try {
            if (this.props.user_id) {
                return (
                    <div id="auth">
                        <Route path="/:db/admin" component={Admin} />
                        <Route path="/:db/user" component={User} />
                        <Password />
                        <Route
                            exact={true}
                            path="/"
                            render={() => <Redirect to="/lumi" />}
                        />
                        <Route exact={true} path="/:db" component={Landing} />
                    </div>
                );
            }

            return <Login />;
        } catch (err) {
            raven.captureException(err);
            raven.showReportDialog();
        }
    }
}

function mapStateToProps(state: Auth.types.IState, ownProps): IStateProps {
    return {
        user_id: state.auth.user_id
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withRouter(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(AuthContainer)
);
