// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Paper } from 'material-ui';

// state
import { IState } from 'client/state';

// modules
import * as User from 'lib/users';
import * as Groups from 'lib/groups';

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
        this.props.dispatch(User.actions.get_user(this.props.user_id));
        this.props.dispatch(Groups.actions.get_groups());
    }

    public render() {
        return (
            <div>
                <Paper>
                    <User.UserContainer user_id={this.props.user_id}>
                        <Groups.GroupsInputContainer
                            user_id={this.props.user_id}
                        />
                    </User.UserContainer>
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