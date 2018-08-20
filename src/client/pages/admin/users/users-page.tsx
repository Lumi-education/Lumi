// modules
import * as React from 'react';
import { connect } from 'react-redux';

import {
    Avatar,
    Paper,
    List,
    ListItem,
    Divider,
    IconButton
} from 'material-ui';
import FilterBar from 'lib/ui/components/filter-bar';
import ActionBar from 'lib/ui/components/action-bar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import SVGView from 'material-ui/svg-icons/image/remove-red-eye';
import SVGCheck from 'material-ui/svg-icons/navigation/check';

import SVGGroup from 'material-ui/svg-icons/social/group';
import SVGCards from 'material-ui/svg-icons/action/perm-device-information';

import CreateUserDialog from '../dialogs/create-user';
import AssignGroupDialog from '../dialogs/assign-group';
import AssignMaterialDialog from '../dialogs/assign_material';
import DeleteUserDialog from '../dialogs/delete-user';

// state
import { IState } from 'client/state';

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
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
    loading?: string;
    loading_step?: number;
}

export class AdminUsers extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: '',
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Benutzer', loading_step: 1 });
        this.props.dispatch(Users.actions.get_users()).then(users_response => {
            this.setState({ loading: 'Gruppen', loading_step: 2 });
            this.props
                .dispatch(Groups.actions.get_groups())
                .then(groups_response => {
                    this.setState({ loading: 'finished', loading_step: 3 });
                });
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

        return (
            <div>
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })
                    }
                />
                <Paper>
                    <List>
                        {this.props.users
                            .filter(
                                user =>
                                    user.name.indexOf(this.state.search_text) >
                                    -1
                            )
                            .sort(Core.utils.alphabetically)
                            .map((user: Users.IUser) => (
                                <div key={user._id}>
                                    <ListItem
                                        style={{
                                            backgroundColor:
                                                this.props.selected_users.indexOf(
                                                    user._id
                                                ) > -1
                                                    ? 'lightgrey'
                                                    : 'white'
                                        }}
                                        onClick={() =>
                                            this.props.dispatch(
                                                Users.actions.select_user(
                                                    user._id
                                                )
                                            )
                                        }
                                        primaryText={user.name}
                                        rightIconButton={
                                            <IconButton
                                                onClick={() =>
                                                    this.props.dispatch(
                                                        push(
                                                            '/admin/users/' +
                                                                user._id
                                                        )
                                                    )
                                                }
                                            >
                                                {this.props.selected_users.indexOf(
                                                    user._id
                                                ) > -1 ? (
                                                    <SVGCheck />
                                                ) : (
                                                    <SVGView />
                                                )}
                                            </IconButton>
                                        }
                                        leftAvatar={
                                            <Avatar>
                                                {user.name.substring(0, 3)}
                                            </Avatar>
                                        }
                                        secondaryText={
                                            <div
                                                style={{
                                                    overflow: 'hidden',
                                                    margin: '4px 0px 0px',
                                                    color: 'black',
                                                    lineHeight: '16px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: '14px',
                                                    height: '16px'
                                                }}
                                            >
                                                {user.groups
                                                    ? user.groups.map(
                                                          group_id => (
                                                              <span
                                                                  key={
                                                                      user._id +
                                                                      group_id
                                                                  }
                                                                  style={{
                                                                      background:
                                                                          'lightgrey',
                                                                      display:
                                                                          'inline',
                                                                      padding:
                                                                          '.2em .6em .3em',
                                                                      fontSize:
                                                                          '75%',
                                                                      fontWeight:
                                                                          'bold',
                                                                      lineHeight: 1,
                                                                      textAlign:
                                                                          'center',
                                                                      whiteSpace:
                                                                          'nowrap',
                                                                      verticalAlign:
                                                                          'baseline',
                                                                      borderRadius:
                                                                          '.25em'
                                                                  }}
                                                              >
                                                                  {
                                                                      this.props.group(
                                                                          group_id
                                                                      ).name
                                                                  }
                                                              </span>
                                                          )
                                                      )
                                                    : null}
                                            </div>
                                        }
                                    />
                                    <Divider inset={true} />
                                </div>
                            ))}
                    </List>
                    {this.props.users.filter(
                        user => user.name.indexOf(this.state.search_text) > -1
                    ).length === 0
                        ? 'Keine Benutzer gefunden.'
                        : null}
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
                <AssignMaterialDialog />
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
        selected_users: state.users.ui.selected_users
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
