import * as React from 'react';
import {connect} from 'react-redux';

// material-ui
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGPower from 'material-ui/svg-icons/action/power-settings-new';
import SVGDashboard from 'material-ui/svg-icons/action/dashboard';
import SVGAssignments from 'material-ui/svg-icons/action/assignment';
import SVGAssignmentsTurnedIn from 'material-ui/svg-icons/action/assignment-turned-in';

// actions
import {push, left_drawer_close, left_drawer_open} from 'lib/ui/actions';

import {logout} from 'lib/auth/actions';

// types
import {IState} from 'client/state';

// modules
import * as Grades from 'lib/grades';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';

declare var process;

interface IStateProps {
    left_drawer_show: boolean;
    user_id: string;
    user: Users.IUser;
    username: string;
    group: (group_id: string) => Groups.IGroup;
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserLeftDrawer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <div>
                <Drawer
                    docked={false}
                    open={this.props.left_drawer_show}
                    swipeAreaWidth={150}
                    onRequestChange={() =>
                        this.props.dispatch(left_drawer_close())
                    }
                    containerStyle={{backgroundColor: '#FFFFFF'}}
                >
                    <AppBar
                        title={this.props.username}
                        showMenuIconButton={true}
                        iconElementLeft={
                            <IconButton>
                                <SVGClose />
                            </IconButton>
                        }
                        onLeftIconButtonTouchTap={() =>
                            this.props.dispatch(left_drawer_close())
                        }
                    />

                    <List>
                        <ListItem
                            primaryText="Dashboard"
                            onClick={() => this.props.dispatch(push('/user'))}
                            leftIcon={<SVGDashboard />}
                        />
                        <ListItem
                            primaryText="Kurse"
                            leftIcon={<SVGAssignments />}
                            primaryTogglesNestedList={true}
                            nestedItems={this.props.user.groups.map(
                                group_id => (
                                    <ListItem
                                        key={group_id}
                                        primaryText={
                                            this.props.group(group_id).name
                                        }
                                        onClick={() =>
                                            this.props.dispatch(
                                                push(
                                                    '/user/flow?course_id=' +
                                                        group_id
                                                )
                                            )
                                        }
                                    />
                                )
                            )}
                        />
                        <ListItem
                            primaryText="Logout"
                            leftIcon={<SVGPower />}
                            onClick={() => this.props.dispatch(logout())}
                        />
                        <Divider />
                        <Subheader>{process.env.VERSION}</Subheader>
                    </List>
                </Drawer>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        left_drawer_show: state.ui.left_drawer_show,
        user: state.users.me,
        user_id: state.auth.user_id,
        username: state.auth.username,
        group: group_id => Groups.selectors.select_group(state, group_id)
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
)(UserLeftDrawer);
