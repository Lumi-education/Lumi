import * as React from 'react';
import {connect} from 'react-redux';

import {IState} from 'client/state';

// container
import AppBar from './app-bar';

// components
import LeftDrawer from './left-drawer';

// actions
import {get_user_collections} from 'lib/collections/actions';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import groups from '../../../../node_modules/client/pages/admin/groups/groups';

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
        this.props.dispatch(get_user_collections());
        this.props.dispatch(Groups.actions.get_groups());
    }

    public render() {
        return (
            <div id="root">
                <AppBar />
                <LeftDrawer />
                <div style={{paddingBottom: '80px'}}>{this.props.children}</div>

                <Core.container.attachmentList />
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
