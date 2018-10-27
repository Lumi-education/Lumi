import * as React from 'react';
import * as debug from 'debug';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { IState } from 'client/state';

import * as Users from 'lib/users';
import * as Groups from 'lib/groups';

// actions

const log = debug('lumi:admin:groups:add_user_dialog');

interface IPassedProps {
    group_id: string;
}

interface IStateProps extends IPassedProps {
    users: Users.IUser[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    user?: Users.IUser;
    error?: string;
    open?: boolean;
}

export class AdminCreateOrAddUserDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            user: undefined,
            open: false
        };

        this.add_user = this.add_user.bind(this);
        this.close = this.close.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(Users.actions.get_users());
    }

    public add_user(user) {
        if (!user) {
            return this.setState({ error: 'Dieser Benutzer existiert nicht.' });
        }
        if (user._id) {
            this.props.dispatch(
                Groups.actions.add_group(user._id, this.props.group_id)
            );
        }

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
                onClick={() => this.add_user(this.state.user)}
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
                        floatingLabelText="Add user"
                        filter={AutoComplete.fuzzyFilter}
                        dataSource={this.props.users}
                        dataSourceConfig={{ text: 'name', value: '_id' }}
                        errorText={this.state.error || null}
                        maxSearchResults={5}
                        fullWidth={true}
                        onNewRequest={user => {
                            log('onNewRequest', user);
                            this.setState({
                                user
                            });
                        }}
                        onUpdateInput={name => {
                            log('onUpdateInput', name);
                        }}
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
