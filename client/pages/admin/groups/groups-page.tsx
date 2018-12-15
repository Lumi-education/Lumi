// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Avatar, Paper, Divider, List, ListItem } from 'material-ui';

import FilterBar from 'lib/ui/components/filter-bar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from 'client/style/style';

import { GroupCreateContainer } from 'client/container';

// types
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as UI from 'lib/ui';

interface IStateProps {
    groups: Groups.IGroup[];
    existing_groupnames: string[];
    classes: any;
    group: Groups.models.Group;

    show_create_group_dialog: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    show_create_group_dialog?: boolean;
    search_text?: string;
    loading?: string;
    loading_step?: number;
}

export class AdminGroups extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: '',
            show_create_group_dialog: false,
            loading: 'init',
            loading_step: 0
        };

        this.close_dialog = this.close_dialog.bind(this);
    }

    public close_dialog() {
        this.setState({ show_create_group_dialog: false });
    }

    public render() {
        const { classes, existing_groupnames, group } = this.props;
        return (
            <div>
                <Paper>
                    <FilterBar
                        filter={this.state.search_text}
                        set_filter={filter =>
                            this.setState({ search_text: filter })
                        }
                    />
                </Paper>
                <Paper>
                    <List>
                        {this.props.groups
                            .filter(_group => {
                                return this.state.search_text === ''
                                    ? true
                                    : _group.name
                                          .toLocaleLowerCase()
                                          .indexOf(
                                              this.state.search_text.toLocaleLowerCase()
                                          ) > -1;
                            })
                            .map((_group, index) => (
                                <div key={_group._id + index}>
                                    <ListItem
                                        leftAvatar={
                                            <Avatar>
                                                {_group.name.substring(0, 3)}
                                            </Avatar>
                                        }
                                        primaryText={_group.name}
                                        onClick={() =>
                                            this.props.dispatch(
                                                UI.actions.push(
                                                    '/admin/groups/' +
                                                        _group._id
                                                )
                                            )
                                        }
                                    />
                                    <Divider inset={true} />
                                </div>
                            ))}
                    </List>
                </Paper>
                <FloatingActionButton
                    onClick={() =>
                        this.props.dispatch(
                            Groups.actions.create_group_dialog(true)
                        )
                    }
                    style={{
                        margin: '20px',
                        bottom: '0px',
                        right: '20px',
                        position: 'fixed'
                    }}
                >
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    className={classes.dialog}
                    title={Core.i18n.t('group_create')}
                    open={this.props.show_create_group_dialog}
                >
                    <DialogTitle id="form-dialog-title">
                        {Core.i18n.t('group_create')}
                    </DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <GroupCreateContainer />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() =>
                                this.props.dispatch(
                                    Groups.actions.create_group_dialog(false)
                                )
                            }
                            color="primary"
                        >
                            {Core.i18n.t('cancel')}
                        </Button>
                        <Button
                            onClick={() =>
                                this.props.dispatch(
                                    Groups.actions.create_group(
                                        group,
                                        existing_groupnames
                                    )
                                )
                            }
                            color="primary"
                        >
                            {Core.i18n.t('create')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        groups: Groups.selectors.groups_list(state),
        existing_groupnames: Groups.selectors
            .groups_list(state)
            .map(group => group.name),
        classes: ownProps.classes,
        group: state.groups.ui.group,
        show_create_group_dialog: state.groups.ui.show_create_group_dialog
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
    )(AdminGroups)
);
