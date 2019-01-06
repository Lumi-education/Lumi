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
import UserCreate from './UserCreate';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Users from 'lib/users';

const log_info = debug('lumi:info:container:user-create-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    users_to_create: string[];
    username_to_create: string;
    user_options: any;
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
    close: () => void;
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

        this.props.close();
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
                    <UserCreate />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.close} color="primary">
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
        open: Users.selectors.dialog(state, 'create'),
        classes: ownProps.classes,
        users_to_create: state.users.ui.users_to_create,
        username_to_create: state.users.ui.username_to_create,
        user_options: state.users.ui.user_options
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        close: () => dispatch(Users.actions.ui_close_dialog('create'))
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UserCreateDialog)
);
