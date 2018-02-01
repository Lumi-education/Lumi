// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';
import * as debug from 'debug';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    RaisedButton
} from 'material-ui';
import SVGGrade from 'material-ui/svg-icons/action/grade';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SVGPreview from 'material-ui/svg-icons/image/remove-red-eye';

// local
import { IState } from '../types';

// types
import * as Users from 'lib/users';
// actions
import { create_user, get_users, delete_user } from 'lib/users/actions';

// modules
import * as Grades from 'lib/grades';

const log = debug('lumi:lib:users:container:user-table');

interface IPassedProps {
    filter: (user: Users.IUser) => boolean;
}

interface IStateProps extends IPassedProps {
    users: Users.IUser[];
    selected_users: string[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserTableContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_users());
    }

    public render() {
        const users = this.props.users.filter(this.props.filter);

        return (
            <Table
                onRowSelection={rows => {
                    switch (rows) {
                        case 'all':
                            this.props.dispatch(
                                Users.actions.set_selected_users(
                                    users.map(u => u._id)
                                )
                            );
                            break;
                        case 'none':
                            this.props.dispatch(
                                Users.actions.set_selected_users([])
                            );
                            break;
                        default:
                            const user_ids = (rows as number[]).map(
                                row => users[row]._id
                            );
                            this.props.dispatch(
                                Users.actions.set_selected_users(user_ids)
                            );
                            log(user_ids);
                    }
                }}
                multiSelectable={true}
            >
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn style={{ width: '10px' }}>
                            Status
                        </TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Note</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody deselectOnClickaway={false}>
                    {users.map(u => (
                        <TableRow
                            key={u._id}
                            selected={
                                this.props.selected_users.indexOf(u._id) > -1
                            }
                        >
                            <TableRowColumn style={{ width: '10px' }}>
                                <Users.container.OnlineStatus user_id={u._id} />
                            </TableRowColumn>
                            <TableRowColumn>
                                <div
                                    onClick={() =>
                                        this.props.dispatch(
                                            push('/admin/users/' + u._id)
                                        )
                                    }
                                >
                                    {u.name}
                                </div>
                            </TableRowColumn>

                            <TableRowColumn>
                                <div
                                    onClick={() =>
                                        this.props.dispatch(
                                            push(
                                                '/admin/users/' +
                                                    u._id +
                                                    '/grades'
                                            )
                                        )
                                    }
                                >
                                    <Grades.CurrentGradeContainer
                                        user_id={u._id}
                                    />
                                </div>
                            </TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: state.users.list,
        filter: ownProps.filter,
        selected_users: state.users.ui.selected_users
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
)(UserTableContainer);
