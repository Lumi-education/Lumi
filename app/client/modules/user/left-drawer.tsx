import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGPower from 'material-ui/svg-icons/action/power-settings-new';
import SVGDashboard from 'material-ui/svg-icons/action/dashboard';
import SVGAssignments from 'material-ui/svg-icons/action/assignment';

// actions
import {
    push,
    left_drawer_close,
    left_drawer_open
} from 'client/packages/ui/actions';

import { logout } from 'client/packages/auth/actions';

// selector
import {
    select_collections_for_user,
    IUserCollection
} from 'client/packages/collections/selectors';

// types
import { IState } from 'client/state';

declare var process;

interface IStateProps {
    left_drawer_show: boolean;
    collections: IUserCollection[];
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
                    containerStyle={{ backgroundColor: '#FFFFFF' }}
                >
                    <AppBar
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
                            primaryText="Arbeitsblätter"
                            onClick={() =>
                                this.props.dispatch(push('/user/assignments'))
                            }
                            leftIcon={<SVGAssignments />}
                            rightAvatar={
                                <Avatar>
                                    {
                                        this.props.collections.filter(
                                            c => !c.submitted
                                        ).length
                                    }
                                </Avatar>
                            }
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
        collections: select_collections_for_user(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserLeftDrawer
);
