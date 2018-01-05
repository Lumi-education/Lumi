// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Paper } from 'material-ui';

// state
import { IState } from 'client/state';

// modules
import { IUser, UserContainer, users_actions } from 'lib/users';
import { GroupsInputContainer, groups_actions } from 'lib/groups';

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
        this.props.dispatch(users_actions.get_user(this.props.user_id));
        this.props.dispatch(groups_actions.get_groups());
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
