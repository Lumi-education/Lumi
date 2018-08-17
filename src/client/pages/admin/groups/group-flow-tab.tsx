// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import * as raven from 'raven-js';

import { uniq, intersection } from 'lodash';
// types
import { IState } from 'client/state';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    Avatar,
    TableRow,
    TableRowColumn,
    Paper,
    Card,
    CardActions,
    CardHeader,
    CardText,
    FlatButton,
    RaisedButton,
    FloatingActionButton
} from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SVGCheck from 'material-ui/svg-icons/navigation/check';

import AssignMaterialDialog from '../dialogs/assign_material';
import * as UI from 'lib/ui';
import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';
import ContentRemove from 'material-ui/svg-icons/content/remove';

const log = debug('lumi:admin:groups:group-flow-tab');

// actions

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    users: Users.IUser[];
    group: Groups.IGroup;
    selected_users: string[];
    selected_assignments: string[];
    user: (user_id: string) => Users.IUser;
    assignment: (assignment_id: string) => Flow.IAssignment;
    card: (card_id: string) => Cards.ICard;
    selected_tags: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: string;
    loading_step?: number;
    error?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupFlowTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Schüler...', loading_step: 1 });

        try {
            this.props.dispatch(Tags.actions.get_tags());

            this.props
                .dispatch(
                    Core.actions.find(
                        {
                            type: 'user',
                            groups: { $in: [this.props.group_id] }
                        },
                        { limit: 30 }
                    )
                )
                .then(user_response => {
                    const assignment_ids = uniq(
                        user_response.payload
                            .map(user => user.flow)
                            .reduce((p, c) => p.concat(c), [])
                    );

                    this.setState({
                        loading: 'Aufträge...',
                        loading_step: 2
                    });

                    this.props
                        .dispatch(
                            Core.actions.find(
                                {
                                    type: 'assignment',
                                    _id: { $in: assignment_ids }
                                },
                                { limit: assignment_ids.length }
                            )
                        )
                        .then(assignment_response => {
                            const card_ids = uniq(
                                assignment_response.payload
                                    .map(assignment => assignment.card_id)
                                    .reduce((p, c) => p.concat(c), [])
                            );

                            this.setState({
                                loading: 'Karten...',
                                loading_step: 3
                            });

                            this.props
                                .dispatch(
                                    Core.actions.find(
                                        {
                                            type: 'card',
                                            _id: { $in: card_ids }
                                        },
                                        { limit: card_ids.length }
                                    )
                                )
                                .then(card_response => {
                                    this.setState({
                                        loading: 'finished',
                                        loading_step: 4
                                    });
                                });
                        });
                });
        } catch (error) {
            this.setState({ loading: 'error', error: JSON.stringify(error) });
        }
    }

    public render() {
        try {
            if (this.state.loading !== 'finished') {
                return (
                    <UI.components.LoadingPage
                        min={1}
                        max={4}
                        value={this.state.loading_step}
                    >
                        {this.state.loading}
                    </UI.components.LoadingPage>
                );
            }

            return (
                <div
                    id="group-flow-tab"
                    style={{
                        background: UI.config.gradient_bg,
                        minHeight: '100vh'
                    }}
                >
                    <Paper style={{ margin: '0px 20px 20px 20px' }} zDepth={5}>
                        <Tags.TagsFilterContainer />
                    </Paper>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                            overflow: 'scroll',
                            zIndex: 200
                        }}
                    >
                        {this.props.group.members.map(user_id => {
                            const user = this.props.user(user_id);
                            return (
                                <Card
                                    key={user_id}
                                    style={{
                                        minWidth: '260px',
                                        margin: '10px',
                                        backgroundColor: '#FAFAFA'
                                    }}
                                >
                                    <CardHeader
                                        title={user.name}
                                        avatar={<Avatar>P</Avatar>}
                                        showExpandableButton={false}
                                    />
                                    <CardText>
                                        {user.flow.map(assignment_id => {
                                            const assignment = this.props.assignment(
                                                assignment_id
                                            );

                                            if (assignment.completed) {
                                                return null;
                                            }

                                            const card = this.props.card(
                                                assignment.card_id
                                            );

                                            if (
                                                intersection(
                                                    card.tags,
                                                    this.props.selected_tags
                                                ).length !==
                                                this.props.selected_tags.length
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    key={assignment._id}
                                                    onClick={() =>
                                                        this.props.dispatch(
                                                            Flow.actions.select_assignment(
                                                                assignment._id
                                                            )
                                                        )
                                                    }
                                                >
                                                    <Card
                                                        style={{
                                                            background:
                                                                this.props.selected_assignments.indexOf(
                                                                    assignment._id
                                                                ) > -1
                                                                    ? 'lightgrey'
                                                                    : 'white'
                                                        }}
                                                    >
                                                        <CardHeader
                                                            title={card.name}
                                                            subtitle={
                                                                <Tags.TagsContainer
                                                                    tag_ids={
                                                                        card.tags
                                                                    }
                                                                />
                                                            }
                                                            showExpandableButton={
                                                                false
                                                            }
                                                            avatar={
                                                                <Avatar
                                                                    backgroundColor={UI.utils.get_grade_color(
                                                                        assignment.data !==
                                                                        null
                                                                            ? assignment
                                                                                  .data[
                                                                                  assignment
                                                                                      .data
                                                                                      .length -
                                                                                      1
                                                                              ]
                                                                                  .score /
                                                                              assignment
                                                                                  .data[
                                                                                  assignment
                                                                                      .data
                                                                                      .length -
                                                                                      1
                                                                              ]
                                                                                  .maxScore
                                                                            : null
                                                                    )}
                                                                >
                                                                    {assignment.data !==
                                                                    null
                                                                        ? (assignment
                                                                              .data[
                                                                              assignment
                                                                                  .data
                                                                                  .length -
                                                                                  1
                                                                          ]
                                                                              .score /
                                                                              assignment
                                                                                  .data[
                                                                                  assignment
                                                                                      .data
                                                                                      .length -
                                                                                      1
                                                                              ]
                                                                                  .maxScore) *
                                                                          100
                                                                        : null}
                                                                </Avatar>
                                                            }
                                                        />
                                                    </Card>
                                                </div>
                                            );
                                        })}
                                        <RaisedButton
                                            style={{ marginTop: '15px' }}
                                            fullWidth={true}
                                            primary={true}
                                            icon={<ContentAdd />}
                                            onClick={() => {
                                                this.props.dispatch(
                                                    Users.actions.set_selected_users(
                                                        [user._id]
                                                    )
                                                );
                                                this.props.dispatch(
                                                    UI.actions.toggle_assign_material_dialog()
                                                );
                                            }}
                                        />
                                    </CardText>
                                </Card>
                            );
                        })}
                        <UI.components.ActionBar>
                            {this.props.selected_assignments.length !== 0 ? (
                                <div>
                                    <FloatingActionButton
                                        onClick={() => {
                                            this.props.dispatch(
                                                Flow.actions.update_assignments(
                                                    this.props
                                                        .selected_assignments,
                                                    { completed: true }
                                                )
                                            );
                                        }}
                                        style={{
                                            margin: '20px',
                                            zIndex: 5000
                                        }}
                                    >
                                        <SVGCheck />
                                    </FloatingActionButton>
                                    <FloatingActionButton
                                        onClick={() => {
                                            this.props.dispatch(
                                                Flow.actions.delete_assignments(
                                                    this.props
                                                        .selected_assignments
                                                )
                                            );
                                            this.props.dispatch(
                                                Flow.actions.set_selected_assignments(
                                                    []
                                                )
                                            );
                                        }}
                                        style={{
                                            margin: '20px',
                                            zIndex: 5000
                                        }}
                                    >
                                        <ContentRemove />
                                    </FloatingActionButton>
                                </div>
                            ) : null}
                            <FloatingActionButton
                                onClick={() => {
                                    this.props.dispatch(
                                        Users.actions.set_selected_users(
                                            this.props.users.map(
                                                user => user._id
                                            )
                                        )
                                    );
                                    this.props.dispatch(
                                        UI.actions.toggle_assign_material_dialog()
                                    );
                                }}
                                style={{
                                    margin: '20px',
                                    zIndex: 5000
                                }}
                            >
                                <ContentAdd />
                            </FloatingActionButton>
                            {/* <AssignMaterialDialog
                            group_id={this.props.group_id}
                            user_ids={this.props.users.map(user => user._id)}
                        /> */}
                        </UI.components.ActionBar>
                        <AssignMaterialDialog />
                    </div>
                </div>
            );
        } catch (error) {
            log(error);
            raven.captureException(error);

            return (
                <UI.components.ErrorPage>
                    {JSON.stringify(error)}
                </UI.components.ErrorPage>
            );
        }
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group_id: ownProps.group_id,
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        users: Users.selectors.get_users_by_group(state, ownProps.group_id),
        user: user_id => Users.selectors.user(state, user_id),
        group: Groups.selectors.select_group(state, ownProps.group_id),
        selected_users: state.users.ui.selected_users,
        selected_assignments: state.flow.ui.selected_assignments,
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        selected_tags: state.tags.ui.selected_tags
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
