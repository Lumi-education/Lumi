// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UserCreateContainer } from 'client/container';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Users from 'lib/users';

const log_info = debug('lumi:info:container:user-create-dialog');

interface IPassedProps {
    user_options?: any;
}

interface IStateProps extends IPassedProps {
    open: boolean;
    users_to_create: string[];
    username_to_create: string;
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class UserCreateDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            users: []
        };

        this.create_users = this.create_users.bind(this);
    }

    public create_users() {
        log_info('create_users', 'start', this.props.users_to_create);

        this.props.dispatch(
            Users.actions.create_users(
                this.props.users_to_create.map(
                    username =>
                        new Users.models.User(
                            assign(this.props.user_options, { name: username })
                        )
                )
            )
        );
    }

    public render() {
        const { classes } = this.props;
        return (
            <Dialog
                className={classes.dialog}
                title={Core.i18n.t('user_create')}
                open={this.props.open}
            >
                <DialogTitle id="form-dialog-title">
                    {Core.i18n.t('user_create')}
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <UserCreateContainer />
                </DialogContent>
                <DialogActions>
                    <Button color="primary">{Core.i18n.t('cancel')}</Button>
                    <Button
                        disabled={
                            this.props.username_to_create !== '' ||
                            this.props.users_to_create.length === 0
                        }
                        onClick={this.create_users}
                        color="primary"
                    >
                        {Core.i18n.t('create')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: false,
        classes: ownProps.classes,
        users_to_create: state.users.ui.users_to_create,
        username_to_create: state.users.ui.username_to_create,
        user_options: ownProps.user_options
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    dialog: {
        minWidth: '500px'
    },
    dialogContent: {
        minWidth: '500px',
        minHeight: '350px'
    },
    root: {
        display: 'flex'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },

    menuButton: {
        marginLeft: 12,
        marginRight: 20
    },
    hide: {
        display: 'none'
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start'
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        margin: 'auto'
    },
    contentContainer: {
        paddingTop: '40px',
        maxWidth: '680px',
        margin: 'auto'
    },
    paperContent: {
        padding: '20px'
    },
    contentList: {
        maxWidth: 680,
        margin: 'auto',
        marginTop: 40
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginRight: 0
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    media: {
        minWidth: 300,
        minHeight: 200
    },
    inputRoot: {
        color: 'inherit',
        width: '100%'
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200
        }
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UserCreateDialog)
);
