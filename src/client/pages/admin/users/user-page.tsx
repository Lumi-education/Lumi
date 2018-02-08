// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import { Paper, Tabs, Tab, FloatingActionButton, MenuItem } from 'material-ui';
import SVGGrade from 'material-ui/svg-icons/action/grade';
import SVGDelete from 'material-ui/svg-icons/content/remove';
import SVGEdit from 'material-ui/svg-icons/content/create';

import ActionBar from 'lib/ui/components/action-bar';

import CollectionAssignments from 'client/composites/collection-assignments';

// state
import { IState } from 'client/state';

// modules
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';
import * as Grades from 'lib/grades';
import * as Collections from 'lib/collections';

interface IStateProps {
    user_id: string;
    tab: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminUserPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Users.actions.get_user(this.props.user_id));
        this.props.dispatch(Users.actions.init(this.props.user_id));
        this.props.dispatch(Groups.actions.get_groups());
    }

    public render() {
        return (
            <div>
                <Tabs
                    style={{
                        backgroundColor: '#FFFFFF',
                        zIndex: 1099,
                        width: '100%'
                    }}
                    tabItemContainerStyle={{
                        background: 'linear-gradient(120deg, #8e44ad, #3498db)'
                    }}
                    value={this.props.tab}
                >
                    <Tab
                        label="Settings"
                        value="settings"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/users/' +
                                        this.props.user_id +
                                        '/settings'
                                )
                            )
                        }
                    />
                    <Tab
                        label="Grades"
                        value="grades"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/users/' +
                                        this.props.user_id +
                                        '/grades'
                                )
                            )
                        }
                    />
                    <Tab
                        label="Assignments"
                        value="assignments"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/users/' +
                                        this.props.user_id +
                                        '/assignments'
                                )
                            )
                        }
                    />
                </Tabs>
                {(() => {
                    switch (this.props.tab) {
                        case 'settings':
                        default:
                            return (
                                <Paper>
                                    <Users.UserContainer
                                        user_id={this.props.user_id}
                                    >
                                        <Groups.GroupsInputContainer
                                            user_id={this.props.user_id}
                                        />
                                    </Users.UserContainer>
                                </Paper>
                            );
                        case 'grades':
                            return (
                                <div>
                                    <Grades.CurrentGradeListContainer
                                        user_id={this.props.user_id}
                                    />
                                    <Grades.GradeListContainer
                                        user_id={this.props.user_id}
                                        menuItems={[
                                            (grade: Grades.IGrade) => (
                                                <MenuItem
                                                    key={grade._id + '-1'}
                                                    leftIcon={<SVGEdit />}
                                                    onClick={() =>
                                                        this.props.dispatch(
                                                            Grades.actions.show_create_grade_dialog(
                                                                this.props
                                                                    .user_id,
                                                                grade._id
                                                            )
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </MenuItem>
                                            ),
                                            (grade: Grades.IGrade) => (
                                                <MenuItem
                                                    key={grade._id + '-2'}
                                                    leftIcon={<SVGDelete />}
                                                    onClick={() =>
                                                        this.props.dispatch(
                                                            Grades.actions.delete_grade(
                                                                grade._id
                                                            )
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </MenuItem>
                                            )
                                        ]}
                                    />

                                    <ActionBar>
                                        <FloatingActionButton
                                            onClick={() =>
                                                this.props.dispatch(
                                                    Grades.actions.show_create_grade_dialog(
                                                        this.props.user_id
                                                    )
                                                )
                                            }
                                        >
                                            <SVGGrade />
                                        </FloatingActionButton>
                                    </ActionBar>
                                    <Grades.CreateGradeDialogContainer />
                                </div>
                            );
                        case 'assignments':
                            return (
                                <CollectionAssignments
                                    user_id={this.props.user_id}
                                />
                            );
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user_id: ownProps.params.user_id,
        tab: ownProps.params.tab
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminUserPage
);
