// modules
import * as React from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import * as classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';

import CreateUserDialog from 'client/dialogs/user-create-dialog';
import AssignGroupDialog from 'client/dialogs/groups-assign-dialog';

import styles from 'client/style/style';

// state
import { IState } from 'client/state';

// components
import { UserList } from 'client/components';

// modules
import * as UI from 'lib/ui';
import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';
import { push } from 'lib/ui/actions';

interface IStateProps {
    users: Users.models.User[];
    group: (group_id) => Groups.IGroup;
    selected_users: string[];

    search_text: string;
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading?: string;
    loading_step?: number;
}

export class AdminUsers extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillUnmount() {
        this.props.dispatch(Users.actions.selection_reset());
    }

    public render() {
        const users = this.props.users
            .filter(user => user.name.indexOf(this.props.search_text) > -1)
            .sort(Core.utils.alphabetically);

        const { classes } = this.props;

        return (
            <div id="users-page">
                <AppBar position="fixed" className={classNames(classes.appBar)}>
                    <Toolbar disableGutters={!open} style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={() =>
                                    this.props.dispatch(
                                        UI.actions.left_drawer_open()
                                    )
                                }
                                className={classNames(classes.menuButton)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div>
                        <div style={{ flex: 10 }}>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder={Core.i18n.t('search') + '...'}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput
                                    }}
                                    onChange={e =>
                                        this.props.dispatch(
                                            UI.actions.set_search_filter(
                                                e.target.value
                                            )
                                        )
                                    }
                                    value={this.props.search_text}
                                />
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                <div
                    style={{
                        paddingTop: '40px',
                        maxWidth: '680px',
                        margin: 'auto'
                    }}
                >
                    <Typography variant="h5" component="h3">
                        {Core.i18n.t('users')}
                    </Typography>
                    <Paper>
                        <UserList
                            users={users}
                            onListItemClick={(user_id: string) =>
                                this.props.dispatch(
                                    push('/admin/users/' + user_id)
                                )
                            }
                        />
                    </Paper>
                    <FloatingActionButton>
                        <ContentAdd />
                    </FloatingActionButton>
                    <CreateUserDialog />
                    <AssignGroupDialog />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: state.users.list,
        group: group_id => Groups.selectors.select_group(state, group_id),
        selected_users: state.users.ui.selected_users,
        search_text: state.ui.search_filter_text,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(AdminUsers)
);
