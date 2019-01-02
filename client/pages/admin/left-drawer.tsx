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
import SVGSystem from 'material-ui/svg-icons/action/settings';
import SVGUpdate from 'material-ui/svg-icons/action/update';
import SVGDashboard from 'material-ui/svg-icons/action/dashboard';

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
    update_available: boolean;
    unread_comments: Comments.models.Comment[];
    locale: Core.types.Locales;
    system: Core.types.ISystemSettings;
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
        const { system } = this.props;
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
                        showMenuIconButton={true}
                        iconElementLeft={leftIcon}
                        onLeftIconButtonClick={() =>
                            this.props.left_drawer_close()
                        }
                    />

                    <List
                        style={{
                            backgroundColor: '#FFFFFF'
                        }}
                    >
                        <ListItem
                            primaryText={Core.i18n.t('dashboard')}
                            leftIcon={<SVGDashboard />}
                            onClick={() => {
                                this.props.push('/admin/dashboard');
                            }}
                        />
                        <Subheader>{Core.i18n.t('users')}</Subheader>
                        <ListItem
                            primaryText={Core.i18n.t('users')}
                            leftIcon={<SVGPerson />}
                            onClick={() => {
                                this.props.push('/admin/users');
                            }}
                        />
                        <ListItem
                            primaryText={Core.i18n.t('groups')}
                            leftIcon={<SVGGroup />}
                            onClick={() => {
                                this.props.push('/admin/groups');
                            }}
                        />
                        <Divider />

                        <Subheader>{Core.i18n.t('cards')}</Subheader>

                        <ListItem
                            primaryText={Core.i18n.t('cards')}
                            leftIcon={<SVGCards />}
                            onClick={() => {
                                this.props.push('/admin/cards');
                            }}
                        />
                        <Divider />
                        <Subheader>{Core.i18n.t('user')}</Subheader>
                        <ListItem
                            primaryText={Core.i18n.t('settings')}
                            leftIcon={<SVGSystem />}
                            onClick={() => this.props.push('/admin/settings')}
                        />
                        <ListItem
                            primaryText={Core.i18n.t('logout')}
                            leftIcon={<SVGPower />}
                            onClick={() =>
                                this.props.dispatch(Auth.actions.logout())
                            }
                        />
                        <Divider />
                        {system.target === 'pi' ? (
                            <div>
                                <Subheader>{Core.i18n.t('system')}</Subheader>
                                <ListItem
                                    primaryText="System"
                                    leftIcon={<SVGSystem />}
                                    onClick={() =>
                                        this.props.push('/admin/system')
                                    }
                                />
                                <ListItem
                                    primaryText={Core.i18n.t('shutdown')}
                                    leftIcon={<SVGPower />}
                                    onClick={() =>
                                        this.props.dispatch(
                                            Core.actions.shutdown()
                                        )
                                    }
                                />
                                <Divider />{' '}
                            </div>
                        ) : null}
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
        update_available: Core.selectors.update_available(state),
        unread_comments: Comments.selectors.unread(
            state,
            '*',
            state.users.me._id
        ),
        locale: state.i18n.locale,
        system: state.core.system
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
