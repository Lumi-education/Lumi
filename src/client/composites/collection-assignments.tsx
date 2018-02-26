// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    RaisedButton
} from 'material-ui';
// local
import { IState } from '../../../src/client/state';

// types
import * as Collections from 'lib/collections';
import * as Cards from 'lib/cards';
import * as Grades from 'lib/grades';

interface IPassedProps {
    user_id: string;
}

interface IStateProps extends IPassedProps {
    assignments: Collections.ICollectionData[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionAssignmentsContainer extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Table
                // onRowSelection={rows => {
                //     switch (rows) {
                //     case 'all':
                //         this.props.dispatch(
                //             Users.actions.set_selected_users(
                //                 users.map(u => u._id)
                //             )
                //         );
                //         break;
                //     case 'none':
                //         this.props.dispatch(
                //             Users.actions.set_selected_users([])
                //         );
                //         break;
                //     default:
                //         const user_ids = (rows as number[]).map(
                //             row => users[row]._id
                //         );
                //         this.props.dispatch(
                //             Users.actions.set_selected_users(user_ids)
                //         );
                //         log(user_ids);
                //     }
                // }}
                multiSelectable={true}
            >
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Abgabe Datum</TableHeaderColumn>
                        <TableHeaderColumn>Note</TableHeaderColumn>
                        <TableHeaderColumn>Abgegeben</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody deselectOnClickaway={false}>
                    {this.props.assignments.map(a => (
                        <TableRow key={a._id}>
                            <TableRowColumn>
                                <div
                                    onClick={() =>
                                        this.props.dispatch(
                                            push(
                                                '/admin/collections/' +
                                                    a.collection_id
                                            )
                                        )
                                    }
                                >
                                    <Collections.container.Name
                                        collection_id={a.collection_id}
                                    />
                                </div>
                            </TableRowColumn>
                            <TableRowColumn>
                                {a.submit_date
                                    ? moment(a.submit_date)
                                          .tz('Europe/Berlin')
                                          .fromNow()
                                    : a.due_date
                                      ? moment(a.due_date)
                                            .tz('Europe/Berlin')
                                            .fromNow()
                                      : 'Keine Frist'}
                            </TableRowColumn>
                            <TableRowColumn>
                                <Grades.container.GradeRef
                                    ref_id={a.collection_id}
                                    user_id={a.user_id}
                                />
                            </TableRowColumn>
                            <TableRowColumn>
                                <Collections.container.State data_id={a._id} />
                            </TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || state.auth.user_id;

    return {
        user_id,
        assignments: Collections.selectors.data(state, user_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(CollectionAssignmentsContainer);
