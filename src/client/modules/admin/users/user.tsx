// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Paper } from 'material-ui';

// local
import { IState } from 'client/state';

// types
import { IUser, UserContainer } from 'lib/users';

import { GroupsInputContainer } from 'lib/groups';

// actions
import { get_user } from 'lib/users/actions';

import { get_groups } from 'lib/groups/actions';

interface IStateProps {
    user_id: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminUserPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(get_user(this.props.user_id));
        this.props.dispatch(get_groups());
    }

    public render() {
        return (
            <div>
                <Paper>
                    <UserContainer user_id={this.props.user_id}>
                        <GroupsInputContainer user_id={this.props.user_id} />
                    </UserContainer>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user_id: ownProps.params.user_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminUserPage
);
