// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import * as debug from 'debug';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UserCreateContainer } from 'client/container';

// local
import { IState } from 'client/state';

import styles from 'client/style/style';
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

        this.close_dialog = this.close_dialog.bind(this);
        this.create_users = this.create_users.bind(this);
    }

    public close_dialog() {
        this.props.dispatch(UI.actions.toggle_create_user_dialog());
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
                    <Button onClick={this.close_dialog} color="primary">
                        {Core.i18n.t('cancel')}
                    </Button>
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
        open: state.ui.show_create_user_dialog,
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

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UserCreateDialog)
);
