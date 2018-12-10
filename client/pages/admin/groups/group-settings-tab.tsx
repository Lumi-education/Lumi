// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { IState } from 'client/state';

// components
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';
import { RaisedButton } from 'material-ui';

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    users: Users.IUser[];
    group: Groups.IGroup;
    selected_users: string[];

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupSettingsTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'init'
        };
    }

    public componentWillMount() {
        this.setState({ loading: Core.i18n.t('users') });
        this.props
            .dispatch(
                Core.actions.find({
                    type: 'user',
                    groups: { $in: [this.props.group_id] }
                })
            )
            .then(user_response => {
                this.setState({ loading: 'finished' });
            });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage>
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        const { classes, group } = this.props;

        return (
            <div className={classes.contentContainer}>
                <Typography variant="h5" component="h3">
                    {Core.i18n.t('settings')}
                </Typography>
                <Paper className={classes.paper}>
                    <TextField
                        id="outlined-name"
                        label={Core.i18n.t('name')}
                        className={classes.textField}
                        value={group.name}
                        onChange={e =>
                            this.props.dispatch(
                                Groups.actions.change_group({
                                    name: e.target.value
                                })
                            )
                        }
                        margin="normal"
                        variant="outlined"
                    />
                    <FormGroup row={true}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={group.autojoin}
                                    onChange={() =>
                                        this.props.dispatch(
                                            Groups.actions.change_group({
                                                autojoin: !group.autojoin
                                            })
                                        )
                                    }
                                />
                            }
                            label={Core.i18n.t('autojoin')}
                        />
                    </FormGroup>
                    <div className={classes.buttons}>
                        <RaisedButton
                            label={Core.i18n.t('save')}
                            onClick={() =>
                                this.props.dispatch(
                                    Core.actions.update<Groups.IGroup>(
                                        this.props.group
                                    )
                                )
                            }
                        />
                        {/* <UI.components.RaisedButton
                            action={Core.actions.update<Groups.IGroup>(
                                this.props.group
                            )}
                            labels={[
                                Core.i18n.t('save'),
                                Core.i18n.t('saving'),
                                Core.i18n.t('saved'),
                                Core.i18n.t('error')
                            ]}
                            fullWidth={false}
                            disabled={false}
                        /> */}
                        {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={() => console.log('test')}
                            className={classes.button}
                            
                        >
                            {Core.i18n.t('save')}
                        </Button> */}
                    </div>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group_id: ownProps.group_id,
        users: Users.selectors.users_in_group(state, ownProps.group_id),
        group: state.groups.ui.group,
        selected_users: state.users.ui.selected_users,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    contentContainer: {
        paddingTop: '40px',
        maxWidth: '680px',
        margin: 'auto'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    paper: {
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
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(GroupSettingsTab)
);
