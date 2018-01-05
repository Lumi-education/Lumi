import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { IState } from 'client/state';

import { IGroup } from 'lib/groups';
import { IUser } from 'lib/users';

// actions
import { get_users, create_user } from 'lib/users/actions';

import { add_group } from 'lib/groups/actions';

interface IPassedProps {
    group_id: string;
}

interface IStateProps extends IPassedProps {
    users: IUser[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    name?: string;

    open?: boolean;
}

export class AdminCreateOrAddUserDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: '',
            open: false
        };

        this.create_or_add_user = this.create_or_add_user.bind(this);
        this.close = this.close.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(get_users());
    }

    public create_or_add_user(user) {
        // if (user._id) {
        this.props.dispatch(add_group(user._id, this.props.group_id));
        // } else {
        //     this.props.dispatch(
        //         create_user(user, { groups: [this.props.group_id] })
        //     );
        // }

        this.close();
    }

    public close() {
        this.setState({ open: false });
    }

    public render() {
        const actions = [
            <FlatButton label="Cancel" primary={true} onClick={this.close} />,
            <FlatButton
                label="Add"
                primary={true}
                onClick={() => this.create_or_add_user(this.state.name)}
            />
        ];

        return (
            <div>
                <FloatingActionButton
                    onClick={() =>
                        this.setState({
                            open: true
                        })
                    }
                    style={{ margin: '20px' }}
                >
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    title="Add User"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    onRequestClose={this.close}
                >
                    <AutoComplete
                        floatingLabelText="Add existing user"
                        filter={AutoComplete.fuzzyFilter}
                        dataSource={this.props.users}
                        dataSourceConfig={{ text: 'name', value: '_id' }}
                        maxSearchResults={5}
                        fullWidth={true}
                        onNewRequest={name => this.setState({ name })}
                        onUpdateInput={name => this.setState({ name })}
                    />
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: state.users.list,
        group_id: ownProps.group_id
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
)(AdminCreateOrAddUserDialog);
