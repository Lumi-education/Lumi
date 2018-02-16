// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as debug from 'debug';

// components
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    FloatingActionButton
} from 'material-ui';

import ActionBar from 'lib/ui/components/action-bar';
import SVGDone from 'material-ui/svg-icons/action/done';
import SVGClose from 'material-ui/svg-icons/navigation/close';

import LoadingPage from 'lib/ui/components/loading-page';

// state
import { IState } from 'client/state';

// modules
import * as Cards from 'lib/cards';
import * as Collections from 'lib/collections';
import * as Core from 'lib/core';
import * as Users from 'lib/users';

const log = debug('lumi:pages:admin:analytics:assignments');

interface IStateProps {
    collections: Collections.ICollectionData[];
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

export class AdminAssignmentsPage extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false
        };
    }

    public componentWillMount() {
        this.setState({ loading: true });

        this.props
            .dispatch(
                Core.actions.find({ data_type: 'collection', submitted: false })
            )
            .then(res => {
                this.props
                    .dispatch(
                        Collections.actions.get_collections(
                            res.payload.map(d => d.collection_id)
                        )
                    )
                    .then(r => {
                        this.setState({ loading: false });
                    });
            });
    }

    public render() {
        if (this.state.loading) {
            return <LoadingPage />;
        }
        return (
            <div>
                <Table
                    onRowSelection={rows => {
                        switch (rows) {
                            case 'all':
                                this.props.dispatch(
                                    Collections.actions.select_collection_data(
                                        this.props.collections.map(c => c._id)
                                    )
                                );
                                break;
                            case 'none':
                                this.props.dispatch(
                                    Collections.actions.select_collection_data(
                                        []
                                    )
                                );
                                break;
                            default:
                                const collection_data_ids = (rows as number[]).map(
                                    row => this.props.collections[row]._id
                                );
                                this.props.dispatch(
                                    Collections.actions.select_collection_data(
                                        collection_data_ids
                                    )
                                );
                        }
                    }}
                    multiSelectable={true}
                >
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>User</TableHeaderColumn>
                            <TableHeaderColumn style={{ width: '10px' }}>
                                Status
                            </TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Due Date</TableHeaderColumn>
                            <TableHeaderColumn>Graded</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                        {this.props.collections
                            .sort((a, b) => {
                                if (!a.due_date) {
                                    return 1;
                                }
                                if (!b.due_date) {
                                    return -1;
                                }
                                return (
                                    new Date(b.due_date as any).getTime() -
                                    new Date(a.due_date as any).getTime()
                                );
                            })
                            .map(c => (
                                <TableRow key={c._id}>
                                    <TableRowColumn>
                                        <Users.container.Name
                                            user_id={c.user_id}
                                        />
                                    </TableRowColumn>
                                    <TableRowColumn style={{ width: '10px' }}>
                                        <Users.container.OnlineStatus
                                            user_id={c.user_id}
                                        />
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        <Collections.container.Name
                                            collection_id={c.collection_id}
                                        />
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        <Collections.container.DueDate
                                            data_id={c._id}
                                        />
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        <Collections.container.IsGraded
                                            data_id={c._id}
                                        />
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <ActionBar>
                    <Collections.CollectionUnsubmitSelectedButtonContainer />
                    <Collections.CollectionSubmitSelectedButtonContainer />
                </ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collections: Collections.selectors.data_query(state, {
            completed: false
        }),
        selected_collection_data: state.collections.ui.selected_collection_data
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        push: (url: string) => dispatch(push(url))
    };
}

export default connect<{}, {}, { collection_id: string }>(
    mapStateToProps,
    mapDispatchToProps
)(AdminAssignmentsPage);
