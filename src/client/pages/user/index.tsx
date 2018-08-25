import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from 'client/state';

import AppBar from './app-bar';
import LeftDrawer from './left-drawer';

// modules
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

interface IStateProps {
    location;
    user_id: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading: string;
    loading_step: number;
}

export class Root extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Benutzer', loading_step: 1 });
        this.props
            .dispatch(Users.actions.get_user(this.props.user_id))
            .then(res => {
                this.setState({ loading: 'finished', loading_step: 2 });
            });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={0}
                    max={2}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        return (
            <div id="root">
                <AppBar />
                <LeftDrawer />
                <div style={{ paddingBottom: '80px' }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        location: ownProps.location,
        user_id: state.users.me._id
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
)(Root);
