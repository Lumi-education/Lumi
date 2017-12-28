import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from 'client/state';

import { ICollection } from 'common/types';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

// components
import { CollectionListComponent } from 'client/packages/collections';

// selectors
import { select_collections_as_array } from 'client/packages/collections/selectors';

// actions
import { left_drawer_open, push } from 'client/packages/ui/actions';

import { get_user_collections } from 'client/packages/collections/actions';

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
                <Paper>
                    <CollectionListComponent
                        collections={this.props.collections}
                        onClick={collection_id =>
                            this.props.dispatch(
                                push('/user/collections/' + collection_id)
                            )
                        }
                    />
                </Paper>
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
