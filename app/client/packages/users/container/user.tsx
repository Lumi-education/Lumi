// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';

import {
    Dialog,
    TextField,
    SelectField,
    MenuItem,
    RaisedButton
} from 'material-ui';

// local
import { IState } from 'client/state';

// types
import { IUser } from 'client/packages/users';

// actions
import {
    get_user,
    add_group,
    rem_group,
    delete_user
} from 'client/packages/users/actions';

import {
    get_groups,
    create_and_add_group
} from 'client/packages/groups/actions';

interface IPassedProps {
    user_id: string;
}
interface IStateProps extends IPassedProps {
    user: IUser;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_delete_dialog: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_delete_dialog: false
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_user(this.props.user_id));
    }

    public render() {
        if (this.props.user) {
            return (
                <div>
                    <TextField
                        hintText="Name"
                        floatingLabelText="Name"
                        value={this.props.user.name}
                        fullWidth={true}
                    />
                    <SelectField
                        floatingLabelText="Level"
                        fullWidth={true}
                        value={this.props.user.level}
                    >
                        <MenuItem value={1} primaryText="Gast" />
                        <MenuItem value={2} primaryText="Benutzer" />
                        <MenuItem value={3} primaryText="Betrachter" />
                        <MenuItem value={4} primaryText="Admin" />
                    </SelectField>
                    {this.props.children}
                    <RaisedButton
                        fullWidth={true}
                        secondary={true}
                        onClick={() =>
                            this.setState({ show_delete_dialog: true })
                        }
                        label="Delete"
                    />

                    <Dialog
                        open={this.state.show_delete_dialog}
                        onRequestClose={() =>
                            this.setState({ show_delete_dialog: false })
                        }
                        title={'Delete user'}
                        actions={[
                            <RaisedButton
                                onClick={() =>
                                    this.setState({ show_delete_dialog: false })
                                }
                                secondary={true}
                                label="NO"
                            />,
                            <RaisedButton
                                onClick={() => {
                                    this.props
                                        .dispatch(
                                            delete_user(this.props.user_id)
                                        )
                                        .then(res =>
                                            this.props.dispatch(
                                                push('/admin/users')
                                            )
                                        );
                                }}
                                primary={true}
                                label="YES"
                            />
                        ]}
                    >
                        Do you really want to delete {this.props.user.name}?
                    </Dialog>
                </div>
            );
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user: state.users.list.filter(u => u._id === ownProps.user_id)[0],
        user_id: ownProps.user_id
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
)(UserContainer);
