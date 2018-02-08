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
import LoadingPage from 'lib/ui/components/loading-page';

// local
import { IState } from 'client/state';

// modules
import * as Grades from 'lib/grades';
import * as Core from 'lib/core';
import * as Users from 'lib/users';

const log = debug('lumi:lib:users:container:user-table');

interface IPassedProps {
    filter: (user: Users.IUser) => boolean;
}

interface IStateProps extends IPassedProps {
    users: Users.IUser[];
    selected_users: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading: boolean;
}
export class UserTableContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    public componentWillMount() {
        this.props.dispatch(Users.actions.get_users()).then(({ payload }) => {
            this.props
                .dispatch(
                    Core.actions.find(
                        {
                            user_id: { $in: payload.map(u => u._id) },
                            type: 'grade'
                        },
                        { limit: 500 }
                    )
                )
                .then(res => this.setState({ loading: false }));
        });
    }

    public render() {
        if (this.state.loading) {
            return <LoadingPage />;
        }
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
