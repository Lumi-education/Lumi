import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGPower from 'material-ui/svg-icons/action/power-settings-new';
import SVGAssignments from 'material-ui/svg-icons/action/assignment';
import SVGSettings from 'material-ui/svg-icons/action/settings';

// actions
import { push, left_drawer_close } from 'lib/ui/actions';
import { logout } from 'lib/auth/actions';

// types
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

declare var process;

interface IStateProps {
    left_drawer_show: boolean;
    user_id: string;
    user: Users.models.User;
    username: string;

    classes: any;
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
        backgroundColor: theme.palette.secondary.main
    }
});

export class UserLeftDrawer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const { classes } = this.props;
        return (
            <div>
                <Drawer
                    open={this.props.left_drawer_show}
                    onClose={() =>
                        this.props.dispatch(UI.actions.left_drawer_close())
                    }
                >
                    <div className={classes.drawerHeader}>
                        <IconButton
                            onClick={() =>
                                this.props.dispatch(
                                    UI.actions.left_drawer_close()
                                )
                            }
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    {/* <AppBar
                        title={this.props.username}
                        showMenuIconButton={true}
                        iconElementLeft={
                            <IconButton>
                                <SVGClose />
                            </IconButton>
                        }
                        onLeftIconButtonClick={() =>
                            this.props.dispatch(left_drawer_close())
                        }
                    /> */}

                    <List>
                        <ListItem
                            button={true}
                            onClick={() =>
                                this.props.dispatch(push('/user/flow'))
                            }
                        >
                            <ListItemIcon>
                                <SVGAssignments />
                            </ListItemIcon>
                            <ListItemText
                                primary={Core.i18n.t('assignments')}
                            />
                        </ListItem>
                        <ListItem
                            button={true}
                            onClick={() =>
                                this.props.dispatch(push('/user/settings'))
                            }
                        >
                            <ListItemIcon>
                                <SVGSettings />
                            </ListItemIcon>
                            <ListItemText primary={Core.i18n.t('settings')} />
                        </ListItem>
                        <ListItem
                            button={true}
                            onClick={() => {
                                this.props.dispatch(push('/'));
                                this.props.dispatch(logout());
                            }}
                        >
                            <ListItemIcon>
                                <SVGPower />
                            </ListItemIcon>
                            <ListItemText primary={Core.i18n.t('logout')} />
                        </ListItem>
                        {/* <ListItem
                            primaryText={Core.i18n.t('settings')}
                            leftIcon={<SVGSettings />}
                            onClick={() =>
                                this.props.dispatch(push('/user/settings'))
                            }
                        />
                        <ListItem
                            primaryText={Core.i18n.t('logout')}
                            leftIcon={<SVGPower />}
                            onClick={() => {
                                this.props.dispatch(push('/'));
                                this.props.dispatch(logout());
                            }}
                        />
                        <Divider />
                        <Subheader>{process.env.VERSION}</Subheader> */}
                    </List>
                </Drawer>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        left_drawer_show: state.ui.left_drawer_show,
        user: state.users.me,
        user_id: state.auth.user_id,
        username: state.auth.username,

        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(UserLeftDrawer)
);
