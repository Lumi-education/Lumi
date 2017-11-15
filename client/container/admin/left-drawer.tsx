// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

// material-ui
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGCollections from 'material-ui/svg-icons/action/book';
import SVGCards from 'material-ui/svg-icons/action/perm-device-information';
import SVGGroup from 'material-ui/svg-icons/social/group';
import SVGTags from 'material-ui/svg-icons/action/label';
import SVGPerson from 'material-ui/svg-icons/social/person';
import SVGPower from 'material-ui/svg-icons/action/power-settings-new';
import SVGTrendingUp from 'material-ui/svg-icons/action/trending-up';

// types
import { IState } from 'client/state';
declare var process;
// actions
import { left_drawer_open, left_drawer_close } from 'client/state/ui/actions';
import { logout } from 'client/state/auth/actions';

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

interface IComponentState {}

export class AdminLeftDrawer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.handleClose = this.handleClose.bind(this);

        this.state = {};
    }

    handleClose() {
        this.props.left_drawer_close();
    }

    render() {
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
                        <Subheader>Material</Subheader>
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
                            primaryText="Progress"
                            leftIcon={<SVGTrendingUp />}
                            onTouchTap={() => {
                                this.props.push('/admin/analytics/progress');
                            }}
                        />
                        <Divider />
                        <Subheader>User</Subheader>
                        <ListItem
                            primaryText="Logout"
                            leftIcon={<SVGPower />}
                            onClick={() => this.props.dispatch(logout())}
                        />
                        <Divider />
                        <Subheader>{'Lumi v' + process.env.VERSION}</Subheader>
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
        left_drawer_open: () => dispatch(left_drawer_open()),
        left_drawer_close: () => dispatch(left_drawer_close()),
        dispatch: action => dispatch(action),
        push: (url: string) => {
            dispatch(left_drawer_close());
            dispatch(push(url));
        }
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminLeftDrawer
);
