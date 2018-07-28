// modules
import * as React from 'react';
import {connect} from 'react-redux';
import {push} from 'lib/ui/actions';
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
import {IState} from '../../../src/client/state';

// types
import * as Collections from 'lib/collections';
import * as Cards from 'lib/cards';
import * as Grades from 'lib/grades';

interface IPassedProps {
    user_id : string;
}

interface IStateProps extends IPassedProps {
    assignments : Collections.ICollectionData[];
}

interface IDispatchProps {
    dispatch : (action) => void;
}

interface IProps extends IStateProps,
IDispatchProps {}

export class CollectionAssignmentsContainer extends React.Component < IProps, {} > {
    constructor(props : IProps) {
        super(props);
    }

    public render() {
        return (
            <Table multiSelectable={true}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Note</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody deselectOnClickaway={false}>
                    {this
                        .props
                        .assignments
                        .map(a => (
                            <TableRow key={a._id}>
                                <TableRowColumn>
                                    <div
                                        onClick={() => this.props.dispatch(push('/admin/collections/' + a.collection_id))}>
                                        <Collections.container.Name collection_id={a.collection_id}/>
                                    </div>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Grades.container.GradeRef ref_id={a.collection_id} user_id={a.user_id}/>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        );
    }
}

function mapStateToProps(state : IState, ownProps) : IStateProps {
    const user_id = ownProps.user_id || state.auth.user_id;

    return {
        user_id,
        assignments: Collections
            .selectors
            .data(state, user_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect < IStateProps,
IDispatchProps,
IPassedProps > (mapStateToProps, mapDispatchToProps)(CollectionAssignmentsContainer);
