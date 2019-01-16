// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import List from '@material-ui/core/List';
import UserListItem from './UserListItem';

// modules
import * as Core from 'lib/core';
import * as Users from 'lib/users';

const log_info = debug('lumi:info:container:user-create-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    users: Users.models.User[];
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
    close: () => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class UserDeleteDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            users: []
        };

        this.delete_users = this.delete_users.bind(this);
    }

    public delete_users() {
        log_info('delete_users', 'start', this.props.users);

        this.props.dispatch(Users.actions.delete_users(this.props.users));

        this.props.close();
    }

    public render() {
        const { classes } = this.props;
        return (
            <Dialog
                className={classes.dialog}
                title={Core.i18n.t('user_delete')}
                open={this.props.open}
            >
                <DialogTitle id="form-dialog-title">
                    {Core.i18n.t('user_delete')}
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <List>
                        {this.props.users.map(user => (
                            <UserListItem key={user._id} user={user} />
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.close} color="primary">
                        {Core.i18n.t('cancel')}
                    </Button>
                    <Button
                        disabled={this.props.users.length === 0}
                        onClick={this.delete_users}
                        color="primary"
                    >
                        {Core.i18n.t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state: Users.types.IState, ownProps): IStateProps {
    return {
        open: Users.selectors.dialog(state, 'delete'),
        users: Users.selectors.users(state, state.users.ui.selected_users),
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        close: () => dispatch(Users.actions.ui_close_dialog('delete'))
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UserDeleteDialog)
);
