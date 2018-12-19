import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { uniq, intersection } from 'lodash';

// types
import { IState } from 'client/state';

// components
import {
    Avatar as MUIAvatar,
    Paper,
    IconMenu,
    MenuItem,
    Card,
    CardHeader,
    CardText,
    RaisedButton,
    FloatingActionButton
} from 'material-ui';

import { Avatar } from 'client/components';

import { TagsChipInputContainer } from 'client/container';

// svg
import ContentAdd from 'material-ui/svg-icons/content/add';
import SVGAction from 'material-ui/svg-icons/action/build';

import CardsAssignDialog from 'client/dialogs/cards-assign-dialog';

// modules
import * as UI from 'lib/ui';
import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';

const log_info = debug('lumi:info:pages:admin:groups:group-flow-tab');

// actions

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    assignments: Flow.models.Assignment[];
    users: Users.IUser[];
    group: Groups.IGroup;
    selected_users: string[];
    selected_assignments: string[];
    user: (user_id: string) => Users.IUser;
    assignment: (assignment_id: string) => Flow.models.Assignment;
    card: (card_id: string) => Cards.ICard;
    selected_tags: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    error?: string;
    tags: string[];
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupFlowTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            tags: []
        };
    }

    public componentWillMount() {
        log_info('componentWillMount');
    }

    public render() {
        return (
            <div
                id="group-flow-tab"
                style={{
                    background: UI.config.gradient_bg,
                    minHeight: '100vh'
                }}
            >
                <Paper>
                    <TagsChipInputContainer
                        tag_ids={this.props.selected_tags}
                        onChange={tag_ids =>
                            this.props.dispatch(
                                Tags.actions.set_selected_tags(tag_ids)
                            )
                        }
                    />
                </Paper>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        overflow: 'scroll'
                    }}
                >
                    {this.props.users
                        .sort((a, b) => {
                            if (a.flow.length > b.flow.length) {
                                return 1;
                            }
                            if (a.flow.length < b.flow.length) {
                                return -1;
                            }
                            return 0;
                        })
                        .map(user => {
                            return (
                                <Card
                                    key={user._id}
                                    style={{
                                        minWidth: '260px',
                                        margin: '10px',
                                        backgroundColor:
                                            this.props.selected_users.indexOf(
                                                user._id
                                            ) > -1
                                                ? '#3a99d9'
                                                : '#FAFAFA'
                                    }}
                                >
                                    <div
                                        onClick={() => {
                                            this.props.dispatch(
                                                Users.actions.select_user(
                                                    user._id
                                                )
                                            );
                                        }}
                                    >
                                        <CardHeader
                                            title={user.name}
                                            avatar={
                                                <Avatar doc={user}>P</Avatar>
                                            }
                                            showExpandableButton={false}
                                        />
                                    </div>
                                    <CardText>
                                        {user.flow.map(assignment_id => {
                                            const assignment = this.props.assignment(
                                                assignment_id
                                            );

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
                                                    onClick={() => {
                                                        log_info(
                                                            'clicked on ',
                                                            assignment
                                                        );
                                                        this.props.dispatch(
                                                            Flow.actions.select_assignment(
                                                                assignment._id
                                                            )
                                                        );
                                                    }}
                                                    onDoubleClick={() => {
                                                        log_info(
                                                            'double-clicked on ',
                                                            assignment
                                                        );
                                                        this.props.dispatch(
                                                            Flow.actions.toggle_dialog()
                                                        );
                                                        this.props.dispatch(
                                                            Flow.actions.change_assignment(
                                                                assignment
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <Card
                                                        style={{
                                                            background:
                                                                assignment.state &&
                                                                assignment.get_score() ===
                                                                    null
                                                                    ? 'yellow'
                                                                    : 'white',
                                                            border:
                                                                this.props.selected_assignments.indexOf(
                                                                    assignment._id
                                                                ) > -1
                                                                    ? '3px solid ' +
                                                                      UI.config
                                                                          .primary_color
                                                                    : null
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
                                                                <MUIAvatar
                                                                    backgroundColor={UI.utils.get_grade_color(
                                                                        assignment.get_score()
                                                                    )}
                                                                >
                                                                    {assignment.get_score()}
                                                                </MUIAvatar>
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
                        <IconMenu
                            iconButtonElement={
                                <FloatingActionButton>
                                    <SVGAction />
                                </FloatingActionButton>
                            }
                            anchorOrigin={{
                                horizontal: 'right',
                                vertical: 'bottom'
                            }}
                            targetOrigin={{
                                horizontal: 'left',
                                vertical: 'top'
                            }}
                        >
                            <MenuItem
                                primaryText={Core.i18n.t('cards_assign')}
                                onClick={() => {
                                    this.props.dispatch(
                                        UI.actions.toggle_assign_material_dialog()
                                    );
                                }}
                            />
                            <MenuItem
                                primaryText={Core.i18n.t(
                                    'select_all_finished_cards'
                                )}
                                onClick={() =>
                                    this.props.dispatch(
                                        Flow.actions.set_selected_assignments(
                                            this.props.assignments
                                                .filter(
                                                    assignment =>
                                                        assignment.state &&
                                                        assignment.get_score() !==
                                                            null
                                                )
                                                .map(
                                                    assignment => assignment._id
                                                )
                                        )
                                    )
                                }
                            />
                            <MenuItem
                                primaryText={Core.i18n.t('select_all_users')}
                                onClick={() => {
                                    this.props.dispatch(
                                        Users.actions.set_selected_users(
                                            this.props.users.map(
                                                user => user._id
                                            )
                                        )
                                    );
                                }}
                            />
                            <MenuItem
                                primaryText={Core.i18n.t(
                                    'reset_user_selection'
                                )}
                                onClick={() => {
                                    this.props.dispatch(
                                        Users.actions.set_selected_users([])
                                    );
                                }}
                            />
                            {this.props.selected_assignments.length !== 0 ? (
                                <div>
                                    <MenuItem
                                        primaryText={Core.i18n.t('archive')}
                                        onClick={() => {
                                            this.props.dispatch(
                                                Flow.actions.archive_assignments(
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
                                    />
                                </div>
                            ) : null}
                        </IconMenu>
                    </UI.components.ActionBar>
                    {/* <CardsAssignDialog
                        assign_callback={test => console.log(test)}
                    /> */}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const users = Users.selectors.users_in_group(state, ownProps.group_id);
    return {
        users,
        group_id: ownProps.group_id,
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        assignments: Flow.selectors.assignments_for_users(
            state,
            users.map(user => user._id)
        ),
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
