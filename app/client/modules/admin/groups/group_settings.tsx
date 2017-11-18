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

// selectors
import { select_group } from 'client/packages/groups/selectors';
import { get_users_by_group } from 'client/packages/users/selectors';

// types
import { IState } from 'client/state';
import { IGroup, IUser } from 'common/types';

// actions
import {
    get_group,
    delete_group,
    create_group
} from 'client/packages/groups/actions';

interface IStateProps {
    group: IGroup;
    users: IUser[];
    group_id: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminGroupSettings extends React.Component<IProps, {}> {
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
                >
                    <Tab label="Settings">
                        <div>test</div>
                    </Tab>
                    <Tab label="Users">
                        <List>
                            {this.props.users.map(user => (
                                <div>
                                    <ListItem
                                        leftAvatar={
                                            <Avatar>
                                                {user.name.substring(0, 3)}
                                            </Avatar>
                                        }
                                        primaryText={user.name}
                                        onClick={() =>
                                            this.props.dispatch(
                                                push('/admin/users/' + user._id)
                                            )}
                                    />
                                    <Divider inset={true} />
                                </div>
                            ))}
                        </List>
                    </Tab>
                    <Tab label="Assignments">
                        <div>test2</div>
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
        group_id: ownProps.params.group_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminGroupSettings
);
