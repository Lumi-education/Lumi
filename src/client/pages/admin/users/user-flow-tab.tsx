// modules
import * as React from 'react';
import {connect} from 'react-redux';
import {uniq} from 'lodash';
import {push} from 'lib/ui/actions';

// types
import {ActionBar} from 'lib/ui';
import {IState} from 'client/state';

import {
    Badge,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    SelectField,
    MenuItem,
    Paper
} from 'material-ui';

import AssignMaterialDialog from '../dialogs/assign_material';

import {Pie} from 'react-chartjs-2';

import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import {CardsContainer} from 'lib/cards/container/cards';
import {assign} from 'lib/flow/actions';
import {stat} from 'fs';
import {get_grade_color} from 'lib/core/utils';
import group from '../../../../../node_modules/client/pages/admin/groups/group';
// actions
interface IPassedProps {
    user_id: string;
    course_id: string;
}
interface IStateProps extends IPassedProps {
    assignments: Flow.IAssignment[];
    assignment: (assignment_id: string) => Flow.IAssignment;
    card_name: (card_id: string) => string;
    user: Users.IUser;
    card: (card_id: string) => Cards.ICard;
    group: (group_id: string) => Groups.IGroup;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserFlowTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'Bitte Kurs auswählen'
        };

        this.select_course = this.select_course.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(Groups.actions.get_groups());
    }

    public select_course(e, i, v) {
        this.props.dispatch(
            push('/admin/users/' + this.props.user_id + '/flow?course_id=' + v)
        );

        this.setState({loading: 'lade Schüler'});

        this.props
            .dispatch(Users.actions.get_user(this.props.user_id))
            .then(user_response => {
                const user: Users.IUser = user_response.payload[0];

                this.setState({loading: 'lade Aufgaben'});
                this.props
                    .dispatch(
                        Core.actions.find(
                            {
                                _id: {
                                    $in: user.flow[this.props.course_id]
                                }
                            },
                            {
                                limit: 25
                            }
                        )
                    )
                    .then(assignment_response => {
                        this.setState({loading: 'lade Karten'});
                        this.props
                            .dispatch(
                                Cards.actions.get_cards(
                                    assignment_response.payload.map(
                                        assignment => assignment.card_id
                                    )
                                )
                            )
                            .then(card_response => {
                                this.setState({loading: 'finished'});
                                this.props.dispatch(
                                    Users.actions.set_selected_users([
                                        this.props.user_id
                                    ])
                                );
                            });
                    });
            });
    }

    public render() {
        return (
            <div>
                <Paper>
                    <SelectField
                        floatingLabelText="Kurs"
                        fullWidth={true}
                        onChange={this.select_course}
                        value={
                            this.props.course_id ||
                            this.props.user.flow[
                                Object.keys(this.props.user.flow)[0]
                            ]
                        }
                    >
                        {this.props.user.groups.map(group_id => (
                            <MenuItem
                                value={group_id}
                                primaryText={this.props.group(group_id).name}
                            />
                        ))}
                    </SelectField>
                </Paper>
                {this.state.loading !== 'finished' ? (
                    <Paper style={{margin: '15px', padding: '20px'}}>
                        {this.state.loading}
                    </Paper>
                ) : (
                    <Paper style={{margin: '15px'}}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderColumn>Typ</TableHeaderColumn>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>Score</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.user.flow[this.props.course_id].map(
                                    assignment_id => {
                                        const assignment = this.props.assignment(
                                            assignment_id
                                        );

                                        return (
                                            <TableRow key={assignment._id}>
                                                <TableRowColumn>
                                                    <Cards.components.CardType
                                                        card_type={
                                                            this.props.card(
                                                                assignment.card_id
                                                            ).card_type
                                                        }
                                                    />
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    {this.props.card_name(
                                                        assignment.card_id
                                                    )}
                                                </TableRowColumn>
                                                <TableRowColumn
                                                    style={{
                                                        backgroundColor: get_grade_color(
                                                            assignment.score
                                                        )
                                                    }}
                                                >
                                                    <Cards.components.CardScore
                                                        score={
                                                            assignment.data !==
                                                            null
                                                                ? assignment
                                                                      .data[
                                                                      assignment
                                                                          .data
                                                                          .length -
                                                                          1
                                                                  ].score /
                                                                  assignment
                                                                      .data[
                                                                      assignment
                                                                          .data
                                                                          .length -
                                                                          1
                                                                  ].maxScore
                                                                : null
                                                        }
                                                    />
                                                </TableRowColumn>
                                            </TableRow>
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                )}
                <ActionBar>
                    {this.props.course_id ? (
                        <AssignMaterialDialog group_id={this.props.course_id} />
                    ) : null}
                </ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        course_id: ownProps.course_id,
        user_id: ownProps.user_id,
        user: Users.selectors.user(state, ownProps.user_id),
        assignments: Flow.selectors.assignment_for_user(
            state,
            ownProps.user_id
        ),
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        card_name: (card_id: string) => Cards.selectors.name(state, card_id),
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        group: (group_id: string) =>
            Groups.selectors.select_group(state, group_id)
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
)(UserFlowTab);
