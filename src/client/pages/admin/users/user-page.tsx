// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import { Paper, Tabs, Tab, FloatingActionButton, MenuItem } from 'material-ui';
import SVGGrade from 'material-ui/svg-icons/action/grade';
import SVGDelete from 'material-ui/svg-icons/content/remove';
import SVGEdit from 'material-ui/svg-icons/content/create';

import ActionBar from 'lib/ui/components/action-bar';

import UserFlowTab from './user-flow-tab';
import UserAnalyticsTab from './user-analytics-tab';

import UserGroupsInput from 'client/container/user-groups';

// state
import { IState } from 'client/state';

// modules
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';
import * as Grades from 'lib/grades';
import * as UI from 'lib/ui';
import * as Tags from 'lib/tags';

interface IStateProps {
    user_id: string;
    tab: string;
    course_id: string;
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
                        background: UI.config.gradient_bg
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
                        label="Analyse"
                        value="analytics"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/users/' +
                                        this.props.user_id +
                                        '/analytics'
                                )
                            )
                        }
                    />
                    <Tab
                        label="Flow"
                        value="flow"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/users/' +
                                        this.props.user_id +
                                        '/flow'
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
                                        <UserGroupsInput
                                            user_id={this.props.user_id}
                                        />
                                    </Users.UserContainer>
                                </Paper>
                            );
                        case 'analytics':
                            return (
                                <UserAnalyticsTab
                                    user_id={this.props.user_id}
                                />
                            );
                        case 'flow':
                            return (
                                <UserFlowTab
                                    user_id={this.props.user_id}
                                    course_id={this.props.course_id}
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
        tab: ownProps.params.tab,
        course_id: ownProps.location.query.course_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminUserPage);
