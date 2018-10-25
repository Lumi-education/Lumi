import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import raven from 'lib/core/raven';
import * as debug from 'debug';

// local
import * as Auth from 'lib/auth';

import Password from './password';
import Login from './Login';
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
                        <Route path="/admin" component={Admin} />
                        <Route path="/user" component={User} />
                        <Password />
                        <Route exact={true} path="/" component={Landing} />
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

function mapStateToProps(state: Auth.IState, ownProps): IStateProps {
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
