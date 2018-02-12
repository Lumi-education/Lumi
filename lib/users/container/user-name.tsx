// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

// modules
import * as Users from '../';

interface IPassedProps {
    user_id: string;
}

interface IStateProps extends IPassedProps {
    user: Users.IUser;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserNameContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.user._id) {
            this.props.dispatch(Users.actions.get_user(this.props.user_id));
        }
    }

    public render() {
        return <div>{this.props.user.name}</div>;
    }
}

function mapStateToProps(state: Users.IState, ownProps): IStateProps {
    return {
        user_id: ownProps.user_id,
        user: Users.selectors.user(state, ownProps.user_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(UserNameContainer);
