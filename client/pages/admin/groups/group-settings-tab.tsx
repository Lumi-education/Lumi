// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
// types
import { IState } from 'client/state';

// components
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

import Dropzone from 'react-dropzone';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';

const log_info = debug('lumi:info:pages:admin:groups:GroupsSettingsTab');

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    users: Users.models.User[];
    group: Groups.models.Group;
    selected_users: string[];
    group_in_state: Groups.models.Group;

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_avatar_dialog: boolean;
    avatar_url: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupSettingsTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_avatar_dialog: false,
            avatar_url: null
        };
    }

    public componentDidUpdate(prevProps: IProps) {
        log_info('componentDidUpdate');
        if (prevProps.group_in_state._rev !== this.props.group_in_state._rev) {
            this.props.dispatch(
                Groups.actions.change_group(this.props.group_in_state)
            );
        }
    }

    public render() {
        const { classes, group } = this.props;

        return (
            <Core.components.Content>
                <Core.components.PaperHeader>
                    <Dropzone
                        style={{}}
                        onDrop={acceptedFiles => {
                            // log_info(acceptedFiles);
                            acceptedFiles.forEach(file => {
                                this.setState({
                                    show_avatar_dialog: true,
                                    avatar_url: file.preview
                                });
                            });
                        }}
                    >
                        <Core.components.Avatar
                            doc={group}
                            key={group._rev}
                            size={120}
                        >
                            {/* <Avatar className={classes.bigAvatar}> */}
                            <AddAPhotoIcon />
                            {/* </Avatar> */}
                        </Core.components.Avatar>
                    </Dropzone>
                    <Typography
                        variant="h6"
                        gutterBottom={true}
                        align="center"
                        color="textPrimary"
                    >
                        <span style={{ color: 'white' }}>{group.name}</span>
                    </Typography>
                </Core.components.PaperHeader>
                <div className={classes.paperContent}>
                    <Grid container={true} spacing={24}>
                        <Grid item={true} xs={12} sm={12}>
                            <TextField
                                required={true}
                                id="name"
                                name="name"
                                label={Core.i18n.t('name')}
                                value={group.name}
                                onChange={e =>
                                    this.props.dispatch(
                                        Groups.actions.change_group({
                                            name: e.target.value
                                        })
                                    )
                                }
                                fullWidth={true}
                                autoComplete="fname"
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <FormGroup row={true}>
                                <FormControlLabel
                                    labelPlacement="start"
                                    control={
                                        <Switch
                                            checked={group.autojoin}
                                            onChange={() =>
                                                this.props.dispatch(
                                                    Groups.actions.change_group(
                                                        {
                                                            autojoin: !group.autojoin
                                                        }
                                                    )
                                                )
                                            }
                                        />
                                    }
                                    label={Core.i18n.t('autojoin')}
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>

                    <div className={classes.buttons}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                this.props.dispatch(
                                    Groups.actions.update_groups([
                                        this.props.group
                                    ])
                                )
                            }
                        >
                            {Core.i18n.t('save')}
                        </Button>
                    </div>
                    <Core.components.AvatarCropDialog
                        open={this.state.show_avatar_dialog}
                        avatar_url={this.state.avatar_url}
                        classes={this.props.classes}
                        close={() =>
                            this.setState({ show_avatar_dialog: false })
                        }
                        save_image={(image: Blob) => {
                            Core.db.putAttachment(
                                group._id,
                                'avatar.jpg',
                                group._rev,
                                image,
                                'image/jpeg'
                            );
                            this.setState({ show_avatar_dialog: false });
                        }}
                    />
                </div>
            </Core.components.Content>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const group_id = ownProps.group_id;
    return {
        group_id,
        users: Users.selectors.users_in_group(state, ownProps.group_id),
        group: Groups.selectors.ui_group(state),
        group_in_state: Groups.selectors.group(state, group_id),
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
    )(GroupSettingsTab)
);
