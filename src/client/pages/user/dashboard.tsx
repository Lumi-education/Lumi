import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from 'client/state';

import { ICollection } from 'lib/collections/types';

import Paper from 'material-ui/Paper';

import UserAssignments from './assignments';

// components
import { CollectionListComponent } from 'lib/collections';

// selectors
import { select_collections_as_array } from 'lib/collections/selectors';

// actions
import { left_drawer_open, push } from 'lib/ui/actions';

import { get_user_collections } from 'lib/collections/actions';

interface IStateProps {
    collections: ICollection[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserDashboard extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_user_collections());
    }

    public render() {
        return (
            <div id="dashboard">
                <UserAssignments />
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collections: select_collections_as_array(state)
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserDashboard
);
