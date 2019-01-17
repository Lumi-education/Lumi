// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { flatten, uniq } from 'lodash';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

// components
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';
import * as Material from 'lib/material';
import * as Flow from 'lib/flow';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    selected_users: Users.models.User[];
    selected_material: Material.models.Material[];
    groups: Groups.models.Group[];
    users_in_group: (group_id: string) => Users.models.User[];
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class MaterialAssignDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};

        this.assign_material = this.assign_material.bind(this);
    }

    public assign_material() {
        const material_ids = this.props.selected_material.map(
            material => material._id
        );
        this.props.dispatch(
            Flow.actions.assign(
                this.props.selected_users.map(user => user._id),
                material_ids
            )
        );
        this.props.dispatch(
            Groups.actions.update_groups(
                this.props.groups.map(g => g.add_material(material_ids))
            )
        );
    }

    public render() {
        const { classes } = this.props;
        return (
            <Dialog fullWidth={true} maxWidth={'xl'} open={this.props.open}>
                <DialogTitle>{Core.i18n.t('users')}</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    Assign{' '}
                    {this.props.selected_material.length + ' Cards to users'}
                    <Groups.components.GroupsChipInput
                        group_ids={this.props.groups.map(group => group._id)}
                        onChange={(group_ids: string[]) => {
                            this.props.dispatch(
                                Groups.actions.set_selected_groups(group_ids)
                            );
                            const user_ids = uniq(
                                flatten(
                                    group_ids.map(group_id =>
                                        this.props
                                            .users_in_group(group_id)
                                            .map(user => user._id)
                                    )
                                )
                            );
                            this.props.dispatch(
                                Users.actions.set_selected_users(user_ids)
                            );
                        }}
                    />
                    <Users.components.UserChipInput
                        user_ids={this.props.selected_users.map(
                            user => user._id
                        )}
                        onChange={user_ids =>
                            this.props.dispatch(
                                Users.actions.set_selected_users(user_ids)
                            )
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() =>
                            this.props.dispatch(
                                Flow.actions.ui_close_user_assign_dialog()
                            )
                        }
                        color="primary"
                    >
                        {Core.i18n.t('cancel')}
                    </Button>
                    <Button onClick={this.assign_material} color="primary">
                        {Core.i18n.t('material.assign')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        selected_users: Users.selectors.selected_users(state),
        selected_material: Material.selectors.selected_material(state),
        groups: Groups.selectors.selected_groups(state),
        users_in_group: (group_id: string) =>
            Users.selectors.users_in_group(state, group_id),
        open: state.flow.ui.show_user_assign_dialog
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    dialogContent: {
        minHeight: '350px'
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(MaterialAssignDialog)
);
