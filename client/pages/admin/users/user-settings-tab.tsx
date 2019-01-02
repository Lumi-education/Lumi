// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// types
import { IState } from 'client/state';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { GroupsChipInputContainer } from 'client/container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Dropzone from 'react-dropzone';

import { Avatar, AvatarCropDialog } from 'client/components';

import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

declare var window;

const log_info = debug('lumi:info:users:pages:user-settings-tab');

interface IPassedProps {
    user_id: string;

    classes: any;
}
interface IStateProps extends IPassedProps {
    user: Users.models.User;
    user_in_state: Users.models.User;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    avatar_url?: string;
    show_avatar_dialog: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserSettingsTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            avatar_url: null,
            show_avatar_dialog: false
        };
    }

    public componentDidUpdate(prevProps: IProps) {
        if (prevProps.user_in_state._rev !== this.props.user_in_state._rev) {
            this.props.dispatch(
                Users.actions.change_user(this.props.user_in_state)
            );
        }
    }

    public render() {
        const { classes, user } = this.props;
        return (
            <div id="user-settings-tab" className={classes.contentContainer}>
                <Paper className={classes.paper}>
                    <div className={classes.paperHeader}>
                        <div style={{ margin: 'auto' }}>
                            <Dropzone
                                style={{}}
                                onDrop={acceptedFiles => {
                                    log_info(acceptedFiles);
                                    acceptedFiles.forEach(file => {
                                        this.setState({
                                            show_avatar_dialog: true,
                                            avatar_url: file.preview
                                        });
                                    });
                                }}
                            >
                                <Avatar doc={user} size={120}>
                                    {/* <Avatar className={classes.bigAvatar}> */}
                                    <AddAPhotoIcon />
                                    {/* </Avatar> */}
                                </Avatar>
                            </Dropzone>
                        </div>
                        <Typography
                            variant="h6"
                            gutterBottom={true}
                            align="center"
                            color="textPrimary"
                        >
                            <span style={{ color: 'white' }}>{user.name}</span>
                        </Typography>
                    </div>
                    <div className={classes.paperContent}>
                        <Grid container={true} spacing={24}>
                            <Grid item={true} xs={12} sm={12}>
                                <TextField
                                    required={true}
                                    id="username"
                                    name="username"
                                    label={Core.i18n.t('name')}
                                    value={user.name}
                                    onChange={e =>
                                        this.props.dispatch(
                                            Users.actions.change_user({
                                                name: e.target.value
                                            })
                                        )
                                    }
                                    fullWidth={true}
                                    autoComplete="fname"
                                />
                            </Grid>
                            {/* <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="lastName"
                                    name="lastName"
                                    label="Last name"
                                    fullWidth={true}
                                    autoComplete="lname"
                                />
                            </Grid> */}
                            <Grid item={true} xs={12}>
                                {Core.i18n.t('groups')}
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
                            </Grid>
                            {/* <Grid item={true} xs={12}>
                                <TextField
                                    id="addiress2"
                                    name="addiress2"
                                    label="Address line 2"
                                    fullWidth={true}
                                    autoComplete="billing address-line2"
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="city"
                                    name="city"
                                    label="City"
                                    fullWidth={true}
                                    autoComplete="billing address-level2"
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    id="state"
                                    name="state"
                                    label="State/Province/Region"
                                    fullWidth={true}
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="zip"
                                    name="zip"
                                    label="Zip / Postal code"
                                    fullWidth={true}
                                    autoComplete="billing postal-code"
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="country"
                                    name="country"
                                    label="Country"
                                    fullWidth={true}
                                    autoComplete="billing country"
                                />
                            </Grid> */}
                        </Grid>
                        <AvatarCropDialog
                            open={this.state.show_avatar_dialog}
                            avatar_url={this.state.avatar_url}
                            classes={this.props.classes}
                            close={() =>
                                this.setState({ show_avatar_dialog: false })
                            }
                            save_image={(image: Blob) => {
                                Core.db.putAttachment(
                                    user._id,
                                    'avatar.jpg',
                                    user._rev,
                                    image,
                                    'image/jpeg'
                                );
                                this.setState({ show_avatar_dialog: false });
                                //     });
                            }}
                        />
                        <div className={classes.buttons}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() =>
                                    this.props.dispatch(
                                        Users.actions.update_user(
                                            this.props.user
                                        )
                                    )
                                }
                            >
                                {Core.i18n.t('save')}
                            </Button>
                        </div>
                    </div>
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
        user_in_state: Users.selectors.user(state, user_id),
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    bigAvatar: {
        margin: 10,
        width: 120,
        height: 120
    },
    contentContainer: {
        maxWidth: '680px',
        margin: 'auto'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column'
    },
    paperHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit *
            3}px ${theme.spacing.unit * 3}px`
    },
    paperContent: {
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
    )(UserSettingsTab)
);
