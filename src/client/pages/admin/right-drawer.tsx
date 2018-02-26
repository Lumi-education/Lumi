// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// material-ui
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';

import {
    Avatar,
    Divider,
    List,
    ListItem,
    Subheader,
    IconButton,
    MenuItem,
    IconMenu
} from 'material-ui';
import SVGGrade from 'material-ui/svg-icons/action/grade';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SVGPreview from 'material-ui/svg-icons/image/remove-red-eye';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGGroup from 'material-ui/svg-icons/social/group';

import TagFilterContainer from 'lib/tags/container/tag-filter';

// types
import { IState } from 'client/state';
declare var process;
// actions
import {
    right_drawer_close,
    right_drawer_open,
    push,
    set_right_appbar_icon
} from 'lib/ui/actions';
import { logout } from 'lib/auth/actions';

import * as Users from 'lib/users';
import * as Collections from 'lib/collections';
import * as Grades from 'lib/grades';

const log = debug('lumi:pages:cards:right-drawer');

interface IStateProps {
    show: boolean;
    users: Users.IUser[];
}

interface IDispatchProps {
    open: () => void;
    close: () => void;
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class RightDrawer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.handleClose = this.handleClose.bind(this);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Users.actions.get_users());
        this.props.dispatch(
            set_right_appbar_icon(
                <IconButton>
                    <SVGGroup />
                </IconButton>
            )
        );
    }

    public componentWillUnmount() {
        this.props.dispatch(set_right_appbar_icon(null));
    }

    public handleClose() {
        this.props.close();
    }

    public render() {
        const users = this.props.users;
        return (
            <div>
                <Drawer
                    docked={true}
                    open={this.props.show}
                    openSecondary={true}
                    onRequestChange={() => {
                        this.props.show
                            ? this.props.close()
                            : this.props.open();
                    }}
                >
                    <AppBar
                        style={{ backgroundColor: '#3498db' }}
                        showMenuIconButton={true}
                        iconElementLeft={
                            <IconButton>
                                <SVGClose />
                            </IconButton>
                        }
                        onLeftIconButtonTouchTap={() => this.props.close()}
                    />
                    <List>
                        <Subheader>Online</Subheader>
                        {users
                            .filter(u => u.online && u.level <= 2)
                            .map(user => (
                                <div key={user._id}>
                                    <ListItem
                                        leftAvatar={
                                            <Avatar backgroundColor="#2ecc71">
                                                {user.name.substring(0, 3)}
                                            </Avatar>
                                        }
                                        primaryText={user.name}
                                        secondaryText={user.location}
                                        rightIconButton={
                                            <IconMenu
                                                iconButtonElement={
                                                    iconButtonElement
                                                }
                                            >
                                                <MenuItem
                                                    onClick={() =>
                                                        this.props.dispatch(
                                                            push(
                                                                '/admin/users/' +
                                                                    user._id
                                                            )
                                                        )
                                                    }
                                                >
                                                    View
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() =>
                                                        this.props.dispatch(
                                                            Grades.actions.show_create_grade_dialog(
                                                                user._id
                                                            )
                                                        )
                                                    }
                                                >
                                                    Grade
                                                </MenuItem>
                                            </IconMenu>
                                        }
                                    />

                                    <Divider inset={true} />
                                </div>
                            ))}
                        <Subheader>Offline</Subheader>
                        {users.filter(u => !u.online).map(user => (
                            <div key={user._id}>
                                <ListItem
                                    leftAvatar={
                                        <Avatar backgroundColor="#e74c3c">
                                            {user.name.substring(0, 3)}
                                        </Avatar>
                                    }
                                    primaryText={user.name}
                                />
                                <Divider inset={true} />
                            </div>
                        ))}
                    </List>
                </Drawer>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IStateProps {
    return {
        show: state.ui.right_drawer_show,
        users: Users.selectors.query(state, {})
    };
}

function mapDispatchToProps(dispatch) {
    return {
        open: () => dispatch(right_drawer_open()),
        close: () => dispatch(right_drawer_close()),
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    RightDrawer
);

const iconButtonElement = (
    <IconButton touch={true}>
        <MoreVertIcon />
    </IconButton>
);
