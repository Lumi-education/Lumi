import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import {
    AppBar,
    Drawer,
    IconButton,
    List,
    ListItem,
    Subheader,
    Divider
} from 'material-ui';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGCollections from 'material-ui/svg-icons/action/book';
import SVGCards from 'material-ui/svg-icons/action/perm-device-information';
import SVGGroup from 'material-ui/svg-icons/social/group';
import SVGTags from 'material-ui/svg-icons/action/label';
import SVGPerson from 'material-ui/svg-icons/social/person';
import SVGPower from 'material-ui/svg-icons/action/power-settings-new';
import SVGTrendingUp from 'material-ui/svg-icons/action/trending-up';
import SVGAssignment from 'material-ui/svg-icons/action/assignment';
import SVGMonitor from 'material-ui/svg-icons/image/remove-red-eye';

// state
import { IState } from 'client/state';

// modules
import { ui_actions } from 'lib/ui';
import * as Auth from 'lib/auth';
import * as System from 'lib/system';

declare var process;

interface IStateProps {
    left_drawer_show: boolean;
}

interface IDispatchProps {
    left_drawer_open: () => void;
    left_drawer_close: () => void;
    dispatch: (action) => void;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminLeftDrawer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.handleClose = this.handleClose.bind(this);

        this.state = {};
    }

    public handleClose() {
        this.props.left_drawer_close();
    }

    public render() {
        return (
            <div>
                <Drawer
                    docked={false}
                    open={this.props.left_drawer_show}
                    onRequestChange={() => {
                        this.props.left_drawer_show
                            ? this.props.left_drawer_close()
                            : this.props.left_drawer_open();
                    }}
                >
                    <AppBar
                        style={{ backgroundColor: '#8e44ad' }}
                        showMenuIconButton={true}
                        iconElementLeft={
                            <IconButton>
                                <SVGClose />
                            </IconButton>
                        }
                        onLeftIconButtonTouchTap={() =>
                            this.props.left_drawer_close()
                        }
                    />

                    <List style={{ backgroundColor: '#FFFFFF' }}>
                        <Subheader>Users</Subheader>
                        <ListItem
                            primaryText="Users"
                            leftIcon={<SVGPerson />}
                            onTouchTap={() => {
                                this.props.push('/admin/users');
                            }}
                        />
                        <ListItem
                            primaryText="Groups"
                            leftIcon={<SVGGroup />}
                            onTouchTap={() => {
                                this.props.push('/admin/groups');
                            }}
                        />
                        <Divider />
                        <Subheader>Cards</Subheader>
                        <ListItem
                            primaryText="Cards"
                            leftIcon={<SVGCards />}
                            onTouchTap={() => {
                                this.props.push('/admin/cards');
                            }}
                        />
                        <ListItem
                            primaryText="Collections"
                            leftIcon={<SVGCollections />}
                            onTouchTap={() => {
                                this.props.push('/admin/collections');
                            }}
                        />
                        <ListItem
                            primaryText="Tags"
                            leftIcon={<SVGTags />}
                            onTouchTap={() => {
                                this.props.push('/admin/tags');
                            }}
                        />
                        <Divider />
                        <Subheader>Analytics</Subheader>
                        <ListItem
                            primaryText="Monitor"
                            leftIcon={<SVGMonitor />}
                            onTouchTap={() => {
                                this.props.push('/admin/analytics/monitor');
                            }}
                        />
                        {/* <ListItem
                            primaryText="Progress"
                            leftIcon={<SVGTrendingUp />}
                            onTouchTap={() => {
                                this.props.push('/admin/analytics/progress');
                            }}
                        /> */}
                        <ListItem
                            primaryText="Assignments"
                            leftIcon={<SVGAssignment />}
                            onTouchTap={() => {
                                this.props.push('/admin/analytics/assignments');
                            }}
                        />
                        <Divider />
                        <Subheader>User</Subheader>
                        <ListItem
                            primaryText="Logout"
                            leftIcon={<SVGPower />}
                            onClick={() =>
                                this.props.dispatch(Auth.actions.logout())
                            }
                        />
                        <ListItem
                            primaryText="Shutdown"
                            leftIcon={<SVGPower />}
                            onClick={() =>
                                this.props.dispatch(System.actions.shutdown())
                            }
                        />
                        <Divider />
                        <Subheader>
                            <a style={{ textDecoration: 'none' }} href="/docs">
                                {process.env.VERSION}
                            </a>
                        </Subheader>
                    </List>
                </Drawer>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IStateProps {
    return {
        left_drawer_show: state.ui.left_drawer_show
    };
}

function mapDispatchToProps(dispatch) {
    return {
        left_drawer_open: () => dispatch(ui_actions.left_drawer_open()),
        left_drawer_close: () => dispatch(ui_actions.left_drawer_close()),
        dispatch: action => dispatch(action),
        push: (url: string) => {
            dispatch(ui_actions.left_drawer_close());
            dispatch(ui_actions.push(url));
        }
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminLeftDrawer
);
