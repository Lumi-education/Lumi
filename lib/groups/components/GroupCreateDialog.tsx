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
import GroupCreate from './GroupCreate';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Groups from '../';

const log_info = debug('lumi:info:container:user-create-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    classes: any;

    group: Groups.models.Group;

    existing_groupnames: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
    close: () => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class GroupCreateDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            users: []
        };

        this.create_group = this.create_group.bind(this);
    }

    public create_group() {
        log_info('create_group', 'start', this.props.group);

        this.props.dispatch(
            Groups.actions.create_group(
                this.props.group,
                this.props.existing_groupnames
            )
        );

        this.props.close();
    }

    public render() {
        const { classes } = this.props;
        return (
            <Dialog
                className={classes.dialog}
                title={Core.i18n.t('group_create')}
                open={this.props.open}
            >
                <DialogTitle id="form-dialog-title">
                    {Core.i18n.t('group_create')}
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <GroupCreate />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() =>
                            this.props.dispatch(
                                Groups.actions.ui_close_dialog('create')
                            )
                        }
                        color="primary"
                    >
                        {Core.i18n.t('cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            this.props.dispatch(
                                Groups.actions.create_group(
                                    this.props.group,
                                    this.props.existing_groupnames
                                )
                            );
                        }}
                        color="primary"
                    >
                        {Core.i18n.t('create')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state: Groups.types.IState, ownProps): IStateProps {
    return {
        open: Groups.selectors.dialog(state, 'create'),
        classes: ownProps.classes,
        group: Groups.selectors.ui_group(state),
        existing_groupnames: Groups.selectors
            .groups_list(state)
            .map(group => group.name)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        close: () => dispatch(Groups.actions.ui_close_dialog('create'))
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(GroupCreateDialog)
);
