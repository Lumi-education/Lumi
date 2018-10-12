// modules
import * as React from 'react';
import { connect } from 'react-redux';

import {
    TextField,
    SelectField,
    MenuItem,
    RaisedButton,
    Divider
} from 'material-ui';
import ChipInput from 'material-ui-chip-input';

// actions
import { create_and_add_group, add_group, rem_group } from 'lib/groups/actions';

import { IState } from '../state';
import * as UI from 'lib/ui';
import * as Users from 'lib/users';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    users: Users.IUser[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {
    name?: string;
    level?: number;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CreateUserContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: '',
            level: 1
        };
    }

    public componentWillMount() {
        this.props.dispatch(Users.actions.get_users());
    }

    public render() {
        return (
            <div id="create-user">
                <TextField
                    hintText="Name"
                    floatingLabelText="Name"
                    value={this.state.name}
                    fullWidth={true}
                    onChange={(e, name) => {
                        this.setState({
                            name: name.replace(/[^a-z0-9]/gi, '')
                        });
                    }}
                    errorText={
                        this.props.users
                            .map(user => user.name)
                            .indexOf(this.state.name) > -1
                            ? 'Benutzername vergeben'
                            : null
                    }
                    errorStyle={{ color: UI.utils.state_color('error') }}
                />
                {/* <SelectField
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
                </SelectField> */}
                {this.props.children}

                <Divider />
                <UI.components.RaisedButton
                    onSuccess={() =>
                        this.props.dispatch(
                            UI.actions.toggle_create_user_dialog()
                        )
                    }
                    action={Users.actions.create_user(this.state.name)}
                    labels={['Erstellen', 'Erstelle...', 'Erstellt!', 'Fehler']}
                    fullWidth={true}
                    disabled={
                        this.props.users
                            .map(user => user.name)
                            .indexOf(this.state.name) > -1 ||
                        this.state.name.length === 0
                    }
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: state.users.list
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
)(CreateUserContainer);
