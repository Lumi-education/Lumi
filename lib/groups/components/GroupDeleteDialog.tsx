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
import GroupListItem from './GroupListItem';

// modules
import * as Core from 'lib/core';
import * as Groups from '../';

const log_info = debug('lumi:info:container:group-create-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    groups: Groups.models.Group[];
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
    close: () => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class GroupsDeleteDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            groups: []
        };

        this.delete_groups = this.delete_groups.bind(this);
    }

    public delete_groups() {
        log_info('delete_groups', 'start', this.props.groups);

        this.props.dispatch(Groups.actions.delete_groups(this.props.groups));

        this.props.close();
    }

    public render() {
        const { classes } = this.props;
        return (
            <Dialog
                className={classes.dialog}
                title={Core.i18n.t('group_delete')}
                open={this.props.open}
            >
                <DialogTitle id="form-dialog-title">
                    {Core.i18n.t('group_delete')}
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <List>
                        {this.props.groups.map(group => (
                            <GroupListItem group={group} />
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.close} color="primary">
                        {Core.i18n.t('cancel')}
                    </Button>
                    <Button
                        disabled={this.props.groups.length === 0}
                        onClick={this.delete_groups}
                        color="primary"
                    >
                        {Core.i18n.t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state: Groups.types.IState, ownProps): IStateProps {
    return {
        open: Groups.selectors.dialog(state, 'delete'),
        groups: Groups.selectors.selected_groups(state),
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        close: () => dispatch(Groups.actions.ui_close_dialog('delete'))
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(GroupsDeleteDialog)
);
