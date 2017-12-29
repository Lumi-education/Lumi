// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import * as moment from 'moment';

import { Avatar, Divider, List, ListItem } from 'material-ui';

// local
import { IState } from 'client/state';

// types
import { IUser } from 'client/packages/users';

// actions
import {
    create_user,
    get_users,
    delete_user
} from 'client/packages/users/actions';

interface IStateProps {
    users: IUser[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserListContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_users());
    }

    public render() {
        return (
            <List>
                {this.props.users.map(user => (
                    <div key={user._id}>
                        <ListItem
                            leftAvatar={
                                <Avatar>{user.name.substring(0, 3)}</Avatar>
                            }
                            primaryText={user.name}
                            secondaryText={
                                user.last_active
                                    ? moment(user.last_active).fromNow()
                                    : 'never'
                            }
                            onClick={() =>
                                this.props.dispatch(
                                    push('/admin/users/' + user._id)
                                )
                            }
                        />
                        <Divider inset={true} />
                    </div>
                ))}
            </List>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: state.users.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserListContainer
);
