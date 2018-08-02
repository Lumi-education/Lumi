// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { ActionBar } from 'lib/ui';
import { IState } from 'client/state';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui';

import AssignMaterialDialog from '../dialogs/assign_material';

import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';

// actions

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    users: Users.IUser[];
    group: (group_id: string) => Groups.IGroup;
    selected_users: string[];
    assignment: (assignment_id: string) => Flow.IAssignment;
    card: (card_id: string) => Cards.ICard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupFlowTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'init'
        };
    }

    public componentWillMount() {
        this.props.dispatch(Groups.actions.get_groups());

        this.setState({ loading: 'lade Schüler' });

        this.props
            .dispatch(
                Core.actions.find(
                    {
                        type: 'user',
                        groups: { $in: [this.props.group_id] }
                    },
                    { limit: 25 }
                )
            )
            .then(user_response => {
                this.props.dispatch(
                    Users.actions.set_selected_users(
                        user_response.payload.map(user => user._id)
                    )
                );
            });

        this.props
            .dispatch(
                Core.actions.find(
                    {
                        type: 'assignment',
                        group_id: this.props.group_id
                    },
                    { limit: 30 * 25 }
                )
            )
            .then(assignment_response => {
                this.props.dispatch(
                    Cards.actions.get_cards(
                        assignment_response.payload.map(
                            assignment => assignment.card_id as string
                        )
                    )
                );

                this.setState({ loading: 'finished' });
            });
    }

    public render() {
        const table = [];

        for (let i = 0; i < 15; i++) {
            table.push(
                <TableRow key={i} selectable={false}>
                    {this.props.users.map((user, n) => (
                        <TableRowColumn key={user._id + n}>
                            {(() => {
                                const assignment = this.props.assignment(
                                    user.flow[this.props.group_id][i]
                                );
                                if (assignment._id === null) {
                                    return <div />;
                                }
                                return (
                                    <Cards.components.CardType
                                        card_type={
                                            this.props.card(assignment.card_id)
                                                .card_type
                                        }
                                        score={
                                            assignment.data !== null
                                                ? assignment.data[
                                                      assignment.data.length - 1
                                                  ].score /
                                                  assignment.data[
                                                      assignment.data.length - 1
                                                  ].maxScore
                                                : null
                                        }
                                    />
                                );
                            })()}
                        </TableRowColumn>
                    ))}
                </TableRow>
            );
        }
        return (
            <div id="group-flow-tab">
                <Table selectable={false} style={{ overflow: 'scroll' }}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            {this.props.users.map(user => (
                                <TableHeaderColumn>
                                    {user.name}
                                </TableHeaderColumn>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>{table}</TableBody>
                </Table>
                <ActionBar>
                    <AssignMaterialDialog
                        group_id={this.props.group_id}
                        user_ids={this.props.users.map(user => user._id)}
                    />
                </ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group_id: ownProps.group_id,
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        users: Users.selectors.get_users_by_group(state, ownProps.group_id),
        group: (group_id: string) =>
            Groups.selectors.select_group(state, group_id),
        selected_users: state.users.ui.selected_users,
        card: (card_id: string) => Cards.selectors.select_card(state, card_id)
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
)(GroupFlowTab);
