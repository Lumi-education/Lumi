// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import { IState } from 'client/state';

const log_info = debug('lumi:info:container:group-create');
const log_error = debug('lumi:error:container:group-create');

interface IPassedProps {
    onSuccess?: () => void;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IStateProps extends IPassedProps {
    existing_groupnames: string[];
    classes: any;
    group: Groups.models.Group;
    error_message: string;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    name: string;
    error: string;
}

export class GroupCreateContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: '',
            error: null
        };

        this.change_name = this.change_name.bind(this);
        this.create_group = this.create_group.bind(this);
        this.key_down = this.key_down.bind(this);
    }

    public change_name(e) {
        const name = e.target.value.replace(/[^a-z0-9]/gi, '');
        this.props.dispatch(Groups.actions.change_group({ name }));
    }

    public create_group() {
        const { group, existing_groupnames } = this.props;
        log_info('create_group', group, existing_groupnames);
        this.props.dispatch(
            Groups.actions.create_group(group, existing_groupnames)
        );
    }

    public key_down(e) {
        if (e.keyCode === 13) {
            this.create_group();
        }
    }

    public render() {
        const { classes, group } = this.props;
        return (
            <div id="group-create-component">
                <Typography color="error">
                    {Core.i18n.t(this.props.error_message, {
                        name: group.name
                    })}
                </Typography>
                <TextField
                    autoFocus={true}
                    margin="dense"
                    id="name"
                    label={Core.i18n.t('name')}
                    type="text"
                    fullWidth={true}
                    value={group.name}
                    onChange={this.change_name}
                    onKeyDown={this.key_down}
                    error={this.state.error ? true : false}
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        existing_groupnames: Groups.selectors
            .groups_list(state)
            .map(group => group.name),
        classes: ownProps.classes,
        group: state.groups.ui.group,
        error_message: state.groups.ui.error.message
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
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(GroupCreateContainer)
);
