import * as React from 'react';
import {connect} from 'react-redux';
import * as debug from 'debug';

// components
import {AutoComplete} from 'material-ui';
import ChipInput from 'material-ui-chip-input';

// modules
import * as Users from '..';

const log = debug('lumi:lib:users:container:user-chip-input');

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    user_ids: string[];
    users: Users.IUser[];
    all_users: Users.IUser[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UsersChipInputContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Users.actions.get_users());
    }

    public componentWillUnmount() {
        // this     .props     .dispatch(Users.actions.selection_reset());
    }

    public render() {
        return (
            <ChipInput
                hintText="Users"
                floatingLabelText="Users"
                className="filter-bar"
                fullWidth={true}
                value={this.props.users}
                allowDuplicates={false}
                dataSource={this.props.all_users}
                dataSourceConfig={{
                    text: 'name',
                    value: '_id'
                }}
                openOnFocus={true}
                filter={AutoComplete.fuzzyFilter}
                onRequestAdd={user => {
                    if (
                        this.props.all_users.map(u => u._id).indexOf(user._id) >
                        -1
                    ) {
                        this.props.dispatch(
                            Users.actions.select_user(user._id)
                        );
                    }
                }}
                onRequestDelete={user_id =>
                    this.props.dispatch(Users.actions.select_user(user_id))
                }
            />
        );
    }
}

function mapStateToProps(state: Users.IState, ownProps): IStateProps {
    const user_ids = state.users.ui.selected_users || [];

    return {
        user_ids,
        all_users: state.users.list,
        users: Users.selectors.users(state, user_ids)
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
)(UsersChipInputContainer);
