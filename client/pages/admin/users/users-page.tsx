// modules
import * as React from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import FilterBar from 'lib/ui/components/filter-bar';
import ActionBar from 'lib/ui/components/action-bar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

import SVGGroup from 'material-ui/svg-icons/social/group';
import SVGCards from 'material-ui/svg-icons/action/perm-device-information';

import CreateUserDialog from 'client/dialogs/user-create-dialog';
import AssignGroupDialog from 'client/dialogs/groups-assign-dialog';
import DeleteUserDialog from 'client/dialogs/user-delete-dialog';

// state
import { IState } from 'client/state';

// components
import { UserList } from 'client/components';

// modules
import * as UI from 'lib/ui';
import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';
import { push } from 'lib/ui/actions';

interface IStateProps {
    users: Users.IUser[];
    group: (group_id) => Groups.IGroup;
    selected_users: string[];

    search_text: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading?: string;
    loading_step?: number;
}

export class AdminUsers extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: Core.i18n.t('users'), loading_step: 1 });
        this.props.dispatch(Users.actions.get_users()).then(users_response => {
            // this.setState({ loading: 'Gruppen', loading_step: 2 });
            // this.props
            //     .dispatch(Groups.actions.get_groups())
            //     .then(groups_response => {
            this.setState({ loading: 'finished', loading_step: 3 });
            // });
        });
    }

    public componentWillUnmount() {
        this.props.dispatch(Users.actions.selection_reset());
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={0}
                    max={3}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        const users = this.props.users
            .filter(user => user.name.indexOf(this.props.search_text) > -1)
            .sort(Core.utils.alphabetically);

        return (
            <div
                style={{
                    paddingTop: '40px',
                    maxWidth: '680px',
                    margin: 'auto'
                }}
            >
                <Typography variant="h5" component="h3">
                    {Core.i18n.t('users')}
                </Typography>
                <Paper>
                    <UserList
                        users={users}
                        onListItemClick={(user_id: string) =>
                            this.props.dispatch(push('/admin/users/' + user_id))
                        }
                    />
                </Paper>
                <ActionBar>
                    {this.props.selected_users.length > 0 ? (
                        <div>
                            <FloatingActionButton
                                secondary={true}
                                onClick={() => {
                                    this.props.dispatch(
                                        UI.actions.toggle_delete_user_dialog()
                                    );
                                }}
                            >
                                <ContentRemove />
                            </FloatingActionButton>
                            <FloatingActionButton
                                onClick={() => {
                                    this.props.dispatch(
                                        UI.actions.toggle_assign_material_dialog()
                                    );
                                }}
                                style={{
                                    zIndex: 5000
                                }}
                            >
                                <SVGCards />
                            </FloatingActionButton>
                            <FloatingActionButton
                                onClick={() => {
                                    this.props.dispatch(
                                        UI.actions.toggle_assign_group_dialog()
                                    );
                                }}
                            >
                                <SVGGroup />
                            </FloatingActionButton>
                        </div>
                    ) : null}
                    <FloatingActionButton
                        onClick={() => {
                            this.props.dispatch(
                                UI.actions.toggle_create_user_dialog()
                            );
                        }}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </ActionBar>
                <CreateUserDialog />
                <AssignGroupDialog />
                <DeleteUserDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        users: state.users.list,
        group: group_id => Groups.selectors.select_group(state, group_id),
        selected_users: state.users.ui.selected_users,
        search_text: state.ui.search_filter_text
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminUsers);
