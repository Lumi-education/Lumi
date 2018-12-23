// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from 'client/components/avatar';

import styles from 'client/style/style';

import { GroupCreateContainer } from 'client/container';

// types
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

interface IStateProps {
    groups: Groups.models.Group[];
    existing_groupnames: string[];
    classes: any;
    group: Groups.models.Group;
    users: (groups_id: string) => Users.models.User[];
    search_text: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    show_create_group_dialog?: boolean;
    search_text?: string;
    loading?: string;
    loading_step?: number;
}

export class AdminGroups extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: '',
            show_create_group_dialog: false,
            loading: 'init',
            loading_step: 0
        };

        this.close_dialog = this.close_dialog.bind(this);
    }

    public close_dialog() {
        this.setState({ show_create_group_dialog: false });
    }

    public render() {
        const { classes, existing_groupnames } = this.props;
        const groups = this.props.groups
            .filter(group => group.name.indexOf(this.props.search_text) > -1)
            .sort(Core.utils.alphabetically);
        return (
            <div id="groups-page">
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
                <div className={classes.contentList}>
                    <Typography variant="h5" component="h3">
                        {Core.i18n.t('groups')}
                    </Typography>
                    <Paper>
                        <List>
                            {groups.map((group, index) => (
                                <div key={group._id + index}>
                                    <ListItem
                                        onClick={() =>
                                            this.props.dispatch(
                                                UI.actions.push(
                                                    '/admin/groups/' + group._id
                                                )
                                            )
                                        }
                                    >
                                        <Avatar doc={group}>
                                            {group.name.substring(0, 3)}
                                        </Avatar>

                                        <ListItemText
                                            primary={group.name}
                                            secondary={
                                                <span>
                                                    {group.autojoin ? (
                                                        <Typography color="error">
                                                            {Core.i18n.t(
                                                                'autojoin'
                                                            )}
                                                        </Typography>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <Typography>
                                                        {this.props.users(
                                                            group._id
                                                        ).length +
                                                            ' ' +
                                                            Core.i18n.t(
                                                                'users'
                                                            )}
                                                    </Typography>
                                                </span>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </Paper>
                    <FloatingActionButton
                        style={{
                            margin: '20px',
                            bottom: '0px',
                            right: '20px',
                            position: 'fixed'
                        }}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                    <Dialog
                        className={classes.dialog}
                        title={Core.i18n.t('group_create')}
                        open={this.state.show_create_group_dialog}
                    >
                        <DialogTitle id="form-dialog-title">
                            {Core.i18n.t('group_create')}
                        </DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <GroupCreateContainer />
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary">
                                {Core.i18n.t('cancel')}
                            </Button>
                            <Button
                                onClick={() =>
                                    this.props.dispatch(
                                        Groups.actions.create_group(
                                            this.props.group,
                                            existing_groupnames
                                        )
                                    )
                                }
                                color="primary"
                            >
                                {Core.i18n.t('create')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        groups: Groups.selectors.groups_list(state),
        users: (group_id: string) =>
            Users.selectors.users_in_group(state, group_id),
        existing_groupnames: Groups.selectors
            .groups_list(state)
            .map(group => group.name),
        classes: ownProps.classes,
        group: state.groups.ui.group,
        search_text: state.ui.search_filter_text
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
    )(AdminGroups)
);
