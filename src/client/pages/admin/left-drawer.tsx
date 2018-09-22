import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import {
    Avatar,
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
import SVGCards from 'material-ui/svg-icons/action/perm-device-information';
import SVGGroup from 'material-ui/svg-icons/social/group';
import SVGPerson from 'material-ui/svg-icons/social/person';
import SVGPower from 'material-ui/svg-icons/action/power-settings-new';
import SVGActivity from 'material-ui/svg-icons/social/notifications';
import SVGTags from 'material-ui/svg-icons/action/label';
import SVGComments from 'material-ui/svg-icons/communication/comment';

// state
import { IState } from 'client/state';

// modules
import * as Auth from 'lib/auth';
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Comments from 'lib/comments';

declare var process;

interface IStateProps {
    left_drawer_show: boolean;
    unread_comments: Comments.models.Comment[];
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
        const leftIcon = (
            <IconButton>
                <SVGClose />
            </IconButton>
        );

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
                        style={{
                            backgroundColor: UI.config.primary_color
                        }}
                        showMenuIconButton={true}
                        iconElementLeft={leftIcon}
                        onLeftIconButtonTouchTap={() =>
                            this.props.left_drawer_close()
                        }
                    />

                    <List
                        style={{
                            backgroundColor: '#FFFFFF'
                        }}
                    >
                        <Subheader>Lumi</Subheader>
                        <ListItem
                            primaryText="Benutzer"
                            leftIcon={<SVGPerson />}
                            onTouchTap={() => {
                                this.props.push('/admin/users');
                            }}
                        />
                        <ListItem
                            primaryText="Gruppen"
                            leftIcon={<SVGGroup />}
                            onTouchTap={() => {
                                this.props.push('/admin/groups');
                            }}
                        />
                        <ListItem
                            primaryText="Material"
                            leftIcon={<SVGCards />}
                            onTouchTap={() => {
                                this.props.push('/admin/cards');
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
                        <Subheader>Aktivität</Subheader>

                        <ListItem
                            primaryText="Aktivität"
                            leftIcon={<SVGActivity />}
                            onTouchTap={() =>
                                this.props.push('/admin/activity')
                            }
                        />
                        <ListItem
                            primaryText="Kommentare"
                            leftIcon={<SVGComments />}
                            rightAvatar={
                                this.props.unread_comments.length !== 0 ? (
                                    <Avatar
                                        backgroundColor={
                                            UI.config.primary_color
                                        }
                                    >
                                        {this.props.unread_comments.length}
                                    </Avatar>
                                ) : null
                            }
                            onTouchTap={() =>
                                this.props.push('/admin/comments')
                            }
                        />
                        {/* <Subheader>Diagnostik</Subheader>
                        <ListItem
                            primaryText="Monitor"
                            leftIcon={<SVGMonitor />}
                            onTouchTap={() => {
                                this.props.push('/admin/analytics/monitor');
                            }}
                        />
                        <Divider /> */}
                        <Subheader>Benutzer</Subheader>
                        <ListItem
                            primaryText="Abmelden"
                            leftIcon={<SVGPower />}
                            onClick={() =>
                                this.props.dispatch(Auth.actions.logout())
                            }
                        />
                        {/* <Subheader>System</Subheader>

                        <ListItem
                            primaryText="Ausschalten"
                            leftIcon={<SVGPower />}
                            onClick={() =>
                                this.props.dispatch(Core.actions.shutdown())
                            }
                        /> */}
                        <Divider />
                        <Subheader>
                            <a
                                style={{
                                    textDecoration: 'none'
                                }}
                                href="/docs"
                            >
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
        left_drawer_show: state.ui.left_drawer_show,
        unread_comments: Comments.selectors.unread(
            state,
            '*',
            state.users.me._id
        )
    };
}

function mapDispatchToProps(dispatch) {
    return {
        left_drawer_open: () => dispatch(UI.actions.left_drawer_open()),
        left_drawer_close: () => dispatch(UI.actions.left_drawer_close()),
        dispatch: action => dispatch(action),
        push: (url: string) => {
            dispatch(UI.actions.left_drawer_close());
            dispatch(UI.actions.push(url));
        }
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminLeftDrawer);
