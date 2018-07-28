import * as React from 'react';
import {connect} from 'react-redux';
import {push} from '../../ui/actions';
import * as moment from 'moment-timezone';

// components
import {Checkbox} from 'material-ui';
import SVGOnline from 'material-ui/svg-icons/av/fiber-manual-record';

// modules
import * as Users from '..';

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

export class UserOnlineStatusContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.user._id) {
            this.props.dispatch(Users.actions.get_user(this.props.user_id));
        }
    }

    public render() {
        return (
            <Checkbox
                style={{display: 'inline-block'}}
                checkedIcon={<SVGOnline />}
                checked={true}
                iconStyle={{
                    fill: this.props.user.online ? '#2ecc71' : '#e74c3c'
                }}
            />
        );
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
)(UserOnlineStatusContainer);
