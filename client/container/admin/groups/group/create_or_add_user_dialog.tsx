import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';

import { IState } from 'client/state';

import { IGroup, IUser } from 'lib/types';

// actions
import { get_users, add_group, create_user } from 'client/state/users/actions';

interface IStateProps {
    users: IUser[];
    group_id: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    name: string;
}

export class AdminCreateOrAddUserDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: ''
        };

        this.create_or_add_user = this.create_or_add_user.bind(this);
        this.close = this.close.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(get_users());
    }

    public create_or_add_user(user) {
        if (user._id) {
            this.props.dispatch(add_group(user._id, this.props.group_id));
        } else {
            this.props.dispatch(
                create_user(user, { groups: [this.props.group_id] })
            );
        }

        this.close();
    }

    public close() {
        this.props.dispatch(
            push('/admin/groups/' + this.props.group_id + '/users')
        );
    }

    public render() {
        const actions = [
            <FlatButton label="Cancel" primary={true} onClick={this.close} />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={() => this.create_or_add_user(this.state.name)}
            />
        ];

        return (
            <Dialog
                title="Create or Add User"
                actions={actions}
                modal={true}
                open={true}
            >
                <AutoComplete
                    floatingLabelText="Search existing user or create new one"
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={this.props.users.filter(
                        user => user.groups.indexOf(this.props.group_id) === -1
                    )}
                    dataSourceConfig={{ text: 'name', value: '_id' }}
                    maxSearchResults={5}
                    fullWidth={true}
                    onNewRequest={name => this.setState({ name })}
                    onUpdateInput={name => this.setState({ name })}
                />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: state.users.list,
        group_id: ownProps.params.group_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminCreateOrAddUserDialog
);
