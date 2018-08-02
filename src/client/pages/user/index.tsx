import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from 'client/state';

import AppBar from './app-bar';
import LeftDrawer from './left-drawer';

// modules
import * as Groups from 'lib/groups';

interface IStateProps {
    location;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class Root extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(Groups.actions.get_groups());
    }

    public render() {
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
        location: ownProps.location
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
