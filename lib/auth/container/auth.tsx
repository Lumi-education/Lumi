import * as React from 'react';
import { connect } from 'react-redux';
import * as raven from 'raven-js';
import * as debug from 'debug';

// actions
import * as Auth from '../';

const log = debug('lumi:auth');

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
        this.props.dispatch(Auth.actions.get_session());
    }

    public render() {
        try {
            if (this.props.user_id) {
                return (
                    <div id="auth">
                        {this.props.children}
                        <Auth.container.Password />
                    </div>
                );
            }

            return <Auth.container.Login />;
        } catch (err) {
            raven.captureException(err);
            raven.showReportDialog();
        }
    }
}

function mapStateToProps(state: Auth.IState, ownProps: {}): IStateProps {
    return {
        user_id: state.auth.user_id
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AuthContainer
);
