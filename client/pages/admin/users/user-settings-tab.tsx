// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { IState } from 'client/state';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { GroupsChipInputContainer } from 'client/container';

import * as Users from 'lib/users';
import * as UI from 'lib/ui';

interface IPassedProps {
    user_id: string;

    classes: any;
}
interface IStateProps extends IPassedProps {
    user: Users.IUser;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

export class UserSettingsTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const { classes, user } = this.props;
        return (
            <div
                id="user-settings-tab"
                style={{
                    maxWidth: '680px',
                    margin: 'auto'
                }}
            >
                <Paper className={classes.paper}>
                    {' '}
                    <form
                        className={classes.container}
                        noValidate={true}
                        autoComplete="off"
                    >
                        <TextField
                            id="outlined-name"
                            fullWidth={true}
                            label="Name"
                            className={classes.textField}
                            value={user.name}
                            onChange={e =>
                                this.props.dispatch(
                                    Users.actions.change_user({
                                        name: e.target.value
                                    })
                                )
                            }
                            margin="normal"
                            variant="outlined"
                        />
                    </form>
                    <div className={classes.textField}>
                        <GroupsChipInputContainer
                            group_ids={this.props.user.groups}
                            onChange={new_group_ids =>
                                this.props.dispatch(
                                    Users.actions.change_user({
                                        groups: new_group_ids
                                    })
                                )
                            }
                        />
                    </div>
                    <UI.components.RaisedButton
                        fullWidth={true}
                        labels={[
                            'Reset Password',
                            'resetting password',
                            'Password reset',
                            'Fehler'
                        ]}
                        action={Users.actions.update_user(this.props.user._id, {
                            password: null
                        })}
                        disabled={false}
                        className={classes.submit}
                    />
                    <UI.components.RaisedButton
                        action={Users.actions.update_user(
                            this.props.user_id,
                            this.props.user
                        )}
                        labels={[
                            'Speichern',
                            'speichere...',
                            'gespeichert',
                            'Fehler'
                        ]}
                        disabled={false}
                        fullWidth={true}
                        className={classes.submit}
                    />
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.user_id;
    return {
        user_id,
        user: state.users.ui.user,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit *
            3}px ${theme.spacing.unit * 3}px`
    },
    dense: {
        marginTop: 16
    },
    menu: {
        width: 200
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UserSettingsTab)
);
