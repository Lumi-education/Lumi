// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import SVGClose from 'material-ui/svg-icons/navigation/close';
import FilterBar from 'client/components/filter-bar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import { Tabs, Tab } from 'material-ui/Tabs';

import GroupUsers from './group_users';
import GroupCollections from './group_collections';

// selectors
import { select_group } from 'client/state/groups/selectors';
import { get_users_by_group } from 'client/state/users/selectors';
import { select_collections_by_ids } from 'client/state/collections/selectors';

// types
import { IState } from 'client/state';
import { IGroup, IUser, ICollection } from 'common/types';

// actions
import {
    get_group,
    delete_group,
    create_group
} from 'client/state/groups/actions';

interface IStateProps {
    group: IGroup;
    collections: ICollection[];
    users: IUser[];
    group_id: string;
    tab: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminGroup extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(get_group(this.props.group_id));
    }

    public render() {
        if (!this.props.group) {
            return <div>Loading ... </div>;
        }
        return (
            <div>
                <Tabs
                    style={{
                        position: 'fixed',
                        backgroundColor: '#FFFFFF',
                        top: '64px',
                        zIndex: 1099,
                        width: '100%'
                    }}
                    tabItemContainerStyle={{
                        background: 'linear-gradient(120deg, #8e44ad, #3498db)'
                    }}
                    value={this.props.tab}
                >
                    <Tab
                        label="Settings"
                        value="settings"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/groups/' +
                                        this.props.group_id +
                                        '/settings'
                                )
                            )}
                    >
                        <div>test</div>
                    </Tab>
                    <Tab
                        label="Users"
                        value="users"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/groups/' +
                                        this.props.group_id +
                                        '/users'
                                )
                            )}
                    >
                        <GroupUsers {...this.props} />
                    </Tab>
                    <Tab
                        label="Collections"
                        value="collections"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/groups/' +
                                        this.props.group_id +
                                        '/collections'
                                )
                            )}
                    >
                        <GroupCollections {...this.props} />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group: select_group(state, ownProps.params.group_id),
        users: get_users_by_group(state, ownProps.params.group_id),
        collections: select_collections_by_ids(
            state,
            select_group(state, ownProps.params.group_id).assigned_collections
        ),
        tab: ownProps.params.tab,
        group_id: ownProps.params.group_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminGroup
);
