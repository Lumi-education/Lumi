// modules
import * as React from 'react';
import {connect} from 'react-redux';
import {uniq} from 'lodash';
import {push} from 'lib/ui/actions';
import * as debug from 'debug';

// components
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    FloatingActionButton,
    Paper
} from 'material-ui';

import ActionBar from 'lib/ui/components/action-bar';
import SVGDone from 'material-ui/svg-icons/action/done';
import SVGClose from 'material-ui/svg-icons/navigation/close';

import LoadingPage from 'lib/ui/components/loading-page';

import CollectionMonitorTable from 'client/composites/collection-monitor-table';

// state
import {IState} from 'client/state';

// modules
import * as Cards from 'lib/cards';
import * as Collections from 'lib/collections';
import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';

const log = debug('lumi:pages:admin:analytics:monitor');

interface IStateProps {
    collection_data: Collections.ICollectionData[];
    collections: Collections.ICollection[];
    selected_collection_data: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading: boolean;
}

export class AdminMonitorPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false
        };
    }

    public componentWillMount() {
        this.setState({loading: true});
    }

    public render() {
        return (
            <div id="admin-analytics-monitor">
                {/* <Paper>
                    <Groups.GroupsInput
                        hintText="Select the groups you wish to monitor"
                        onAddGroup={group_id => {
                            this.props
                                .dispatch(
                                    Core.actions.find({
                                        groups: { $in: [group_id] },
                                        type: 'group_ref'
                                    })
                                )
                                .then(({ payload }) => {
                                    this.props.dispatch(
                                        Core.actions.find({
                                            type: 'user',
                                            _id: {
                                                $in: payload.map(
                                                    ref => ref.user_id
                                                )
                                            }
                                        })
                                    );
                                });
                        }}
                    />
                </Paper>

                {uniq(
                    this.props.users
                        .map(u => Users.utils.get_collection_id(u.location))
                        .filter(id => id)
                        .filter(id => id !== 'no collection')
                ).map(collection_id => (
                    <CollectionMonitorTable
                        key={collection_id}
                        collection_id={collection_id}
                        user_ids={this.props.users
                            .filter(
                                user =>
                                    Users.utils.get_collection_id(
                                        user.location
                                    ) === collection_id
                            )
                            .map(u => u._id)}
                    />
                ))}

                <Paper>
                    <h1>Offline</h1>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>User</TableHeaderColumn>
                                <TableHeaderColumn>Status</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {this.props.users.filter(u => !u.online).map(u => (
                                <TableRow key={u._id}>
                                    <TableRowColumn>
                                        <Users.container.Name user_id={u._id} />
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        <Users.container.OnlineStatus
                                            user_id={u._id}
                                        />
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper> */}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_data: Collections.selectors.data_query(state, {
            submitted: false
        }),
        selected_collection_data: state.collections.ui.selected_collection_data,
        collections: Collections.selectors.query(state, {})
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        push: (url: string) => dispatch(push(url))
    };
}

export default connect<{}, {}, {collection_id: string}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminMonitorPage);
