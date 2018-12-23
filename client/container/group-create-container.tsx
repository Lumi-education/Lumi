// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import styles from 'client/style/style';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import { IState } from 'client/state';

const log_info = debug('lumi:info:container:group-create');
const log_error = debug('lumi:error:container:group-create');

interface IPassedProps {}

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

export default withStyles(styles)(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(GroupCreateContainer)
);
