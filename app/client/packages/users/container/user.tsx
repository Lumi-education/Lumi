// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push, goBack } from 'client/packages/ui/actions';

import {
    Dialog,
    TextField,
    SelectField,
    MenuItem,
    RaisedButton
} from 'material-ui';

import { RaisedButtonComponent } from 'client/packages/ui';

import { state_color } from 'client/style/utils';

// local
import { IState } from 'client/state';

// types
import { IUser } from 'client/packages/users';

// actions
import {
    get_user,
    update_user,
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
    name?: string;
    level?: number;

    show_delete_dialog?: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: '',
            level: 0,

            show_delete_dialog: false
        };

        this.updated_state = this.updated_state.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(get_user(this.props.user_id)).then(res => {
            this.setState({
                name: this.props.user.name,
                level: this.props.user.level
            });
        });
    }

    public updated_state() {
        return {
            name: this.state.name,
            level: this.state.level
        };
    }

    public render() {
        if (this.props.user) {
            return (
                <div>
                    <TextField
                        hintText="Name"
                        floatingLabelText="Name"
                        value={this.state.name}
                        fullWidth={true}
                        onChange={(e, name) => this.setState({ name })}
                        errorText={
                            this.props.user.name !== this.state.name
                                ? 'Previous: ' + this.props.user.name
                                : null
                        }
                        errorStyle={{ color: state_color('pending') }}
                    />
                    <SelectField
                        floatingLabelText="Level"
                        fullWidth={true}
                        value={this.state.level}
                        onChange={(e, i, v) => this.setState({ level: v })}
                        errorText={
                            this.props.user.level !== this.state.level
                                ? 'Previous: ' + this.props.user.level
                                : null
                        }
                        errorStyle={{ color: state_color('pending') }}
                    >
                        <MenuItem value={1} primaryText="Gast" />
                        <MenuItem value={2} primaryText="Benutzer" />
                        <MenuItem value={3} primaryText="Betrachter" />
                        <MenuItem value={4} primaryText="Admin" />
                    </SelectField>
                    {this.props.children}
                    <RaisedButton
                        fullWidth={true}
                        label="Back"
                        onClick={() => this.props.dispatch(goBack())}
                    />
                    <RaisedButtonComponent
                        dispatch={this.props.dispatch}
                        action={update_user(
                            this.props.user._id,
                            this.updated_state()
                        )}
                        labels={['Save', 'Saving...', 'Saved', 'Not saved']}
                    />
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
                                fullWidth={true}
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
                                fullWidth={true}
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
