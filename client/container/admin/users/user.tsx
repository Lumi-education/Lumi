// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ChipInput from 'material-ui-chip-input';
import AutoComplete from 'material-ui/AutoComplete';

// local
import { IState } from 'client/state';

// types
import { IUser, IGroup } from 'lib/types';

// actions
import { snackbar_open } from 'client/state/ui/actions';
import { get_user, add_group, rem_group } from 'client/state/users/actions';

import { get_groups, create_and_add_group } from 'client/state/groups/actions';

interface IStateProps {
    user: IUser;
    user_id: string;
    groups: Map<string, IGroup>;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminUsers extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
        this.props.dispatch(get_user(this.props.user_id));
        this.props.dispatch(get_groups());
    }

    public render() {
        if (this.props.user) {
            return (
                <div>
                    <Paper>
                        <TextField
                            hintText="Name"
                            floatingLabelText="Name"
                            value={this.props.user.name}
                            fullWidth={true}
                        />
                        <ChipInput
                            hintText="Groups"
                            floatingLabelText="Groups"
                            className="filter-bar"
                            fullWidth={true}
                            value={this.props.user.groups.map(group_id =>
                                this.props.groups.get(group_id, {
                                    _id: 'noid',
                                    name: 'loading',
                                    type: 'group',
                                    assigned_collections: [],
                                    created_at: new Date()
                                })
                            )}
                            allowDuplicates={false}
                            dataSource={this.props.groups.toArray()}
                            dataSourceConfig={{ text: 'name', value: '_id' }}
                            openOnFocus={true}
                            filter={AutoComplete.fuzzyFilter}
                            onRequestAdd={group => {
                                this.props.groups.get(group._id)
                                    ? this.props.dispatch(
                                          add_group(
                                              this.props.user._id,
                                              group._id
                                          )
                                      )
                                    : this.props.dispatch(
                                          create_and_add_group(
                                              this.props.user._id,
                                              group.name
                                          )
                                      );
                            }}
                            onRequestDelete={group_id =>
                                this.props.dispatch(
                                    rem_group(this.props.user._id, group_id)
                                )}
                        />
                    </Paper>
                </div>
            );
        } else {
            return <div>loading</div>;
        }
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user: state.users.list.filter(
            u => u._id === ownProps.params.user_id
        )[0],
        user_id: ownProps.params.user_id,
        groups: state.groups.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminUsers
);
