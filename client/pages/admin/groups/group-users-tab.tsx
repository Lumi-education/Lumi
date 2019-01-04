// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
// types
import { IState } from 'client/state';

// components
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import Avatar from 'lib/core/components/Avatar';
import { Paper } from 'material-ui';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// icons
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

import CreateUserDialog from 'lib/users/components/UserCreateDialog';

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    users: Users.models.User[];
    group: Groups.models.Group;
    selected_users: Users.models.User[];
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_remove_user_dialog: boolean;
    show_add_users_dialog: boolean;
    show_add_existing_users_dialog: boolean;
    user_to_remove: Users.models.User;

    show_create_users_dialog: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupUsersTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_remove_user_dialog: false,
            show_add_users_dialog: false,
            show_add_existing_users_dialog: false,
            user_to_remove: null,

            show_create_users_dialog: false
        };

        this.remove_user = this.remove_user.bind(this);
        this.enable_autojoin = this.enable_autojoin.bind(this);
        this.add_existing_users = this.add_existing_users.bind(this);
    }

    public remove_user() {
        this.props.dispatch(
            Users.actions.remove_users_from_groups(
                this.props.selected_users,
                this.props.group._id
            )
        );
        this.setState({ user_to_remove: null, show_remove_user_dialog: false });
    }

    public enable_autojoin() {
        this.props.dispatch(
            Core.actions.update<Groups.models.Group>(
                assign({}, this.props.group, { autojoin: true })
            )
        );
        this.setState({ show_add_users_dialog: false });
    }

    public add_existing_users() {
        this.props.dispatch(
            Users.actions.add_users_to_group(
                this.props.selected_users,
                this.props.group_id
            )
        );
        this.setState({ show_add_existing_users_dialog: false });
    }

    public render() {
        const { users, group, classes } = this.props;
        return (
            <div>
                <Core.components.Content>
                    <Users.components.List
                        on_add_click={() =>
                            this.setState({ show_add_users_dialog: true })
                        }
                        on_remove_click={() =>
                            this.setState({ show_remove_user_dialog: true })
                        }
                        users={users}
                    />
                </Core.components.Content>
                <Dialog open={this.state.show_remove_user_dialog}>
                    <DialogContent>
                        {Core.i18n.t('remove_user_from_group_confirmation', {
                            group: this.props.group.name
                        })}
                        <List>
                            {this.props.selected_users.map(user => (
                                <Users.components.ListItem user={user} />
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() =>
                                this.setState({
                                    user_to_remove: null,
                                    show_remove_user_dialog: false
                                })
                            }
                            color="primary"
                        >
                            {Core.i18n.t('cancel')}
                        </Button>
                        <Button onClick={this.remove_user} color="primary">
                            {Core.i18n.t('ok')}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    fullWidth={true}
                    maxWidth={'xl'}
                    open={this.state.show_add_users_dialog}
                >
                    <DialogTitle>{Core.i18n.t('add_users')}</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <Grid container={true} spacing={24}>
                            <Grid item={true} md={4} xs={12}>
                                <Card>
                                    <CardHeader
                                        title={Core.i18n.t('autojoin')}
                                        titleTypographyProps={{
                                            align: 'center'
                                        }}
                                        subheaderTypographyProps={{
                                            align: 'center'
                                        }}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="subtitle1"
                                            align="center"
                                        >
                                            {Core.i18n.t('autojoin_explain')}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        className={classes.cardActions}
                                    >
                                        <Button
                                            fullWidth={true}
                                            variant="outlined"
                                            color="primary"
                                            onClick={this.enable_autojoin}
                                        >
                                            {Core.i18n.t('use')}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid item={true} md={4} xs={12}>
                                <Card>
                                    <CardHeader
                                        title={Core.i18n.t('create_users')}
                                        titleTypographyProps={{
                                            align: 'center'
                                        }}
                                        subheaderTypographyProps={{
                                            align: 'center'
                                        }}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="subtitle1"
                                            align="center"
                                        >
                                            {Core.i18n.t(
                                                'create_users_explain'
                                            )}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        className={classes.cardActions}
                                    >
                                        <Button
                                            fullWidth={true}
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                this.props.dispatch(
                                                    Users.actions.ui_show_dialog(
                                                        'create'
                                                    )
                                                );
                                                this.props.dispatch(
                                                    Users.actions.ui_change_user_options(
                                                        {
                                                            groups: [
                                                                this.props.group
                                                                    ._id
                                                            ]
                                                        }
                                                    )
                                                );
                                                this.setState({
                                                    show_add_users_dialog: false
                                                });
                                            }}
                                        >
                                            {Core.i18n.t('use')}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid item={true} md={4} xs={12}>
                                <Card>
                                    <CardHeader
                                        title={Core.i18n.t('add_users')}
                                        titleTypographyProps={{
                                            align: 'center'
                                        }}
                                        subheaderTypographyProps={{
                                            align: 'center'
                                        }}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="subtitle1"
                                            align="center"
                                        >
                                            {Core.i18n.t('add_users_explain')}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        className={classes.cardActions}
                                    >
                                        <Button
                                            fullWidth={true}
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                this.setState({
                                                    show_add_users_dialog: false,
                                                    show_add_existing_users_dialog: true
                                                });
                                            }}
                                        >
                                            {Core.i18n.t('use')}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() =>
                                this.setState({
                                    show_add_users_dialog: false
                                })
                            }
                            color="primary"
                        >
                            {Core.i18n.t('cancel')}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.show_add_existing_users_dialog}>
                    <DialogTitle>{Core.i18n.t('users')}</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <Users.components.UserChipInput
                            user_ids={this.props.selected_users.map(
                                user => user._id
                            )}
                            onChange={user_ids =>
                                this.props.dispatch(
                                    Users.actions.set_selected_users(user_ids)
                                )
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() =>
                                this.setState({
                                    show_add_existing_users_dialog: false
                                })
                            }
                            color="primary"
                        >
                            {Core.i18n.t('cancel')}
                        </Button>
                        <Button
                            onClick={this.add_existing_users}
                            color="primary"
                        >
                            {Core.i18n.t('ok')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const group_id = ownProps.group_id;
    return {
        group_id,
        users: Users.selectors.users_in_group(state, ownProps.group_id),
        group: Groups.selectors.group(state, group_id),
        selected_users: Users.selectors.selected_users(state),
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    cardHeader: {
        backgroundColor: theme.palette.grey[200]
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing.unit * 2
    },
    cardActions: {
        [theme.breakpoints.up('sm')]: {
            paddingBottom: theme.spacing.unit * 2
        }
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(GroupUsersTab)
);
