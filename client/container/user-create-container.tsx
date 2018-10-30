// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { TextField, Divider } from 'material-ui';

// actions
import { IState } from '../state';
import * as Core from 'lib/core';
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
                    hintText={Core.i18n.t('name')}
                    floatingLabelText={Core.i18n.t('name')}
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
                            ? Core.i18n.t('username_exists')
                            : null
                    }
                    errorStyle={{ color: UI.utils.state_color('error') }}
                />
                {this.props.children}

                <Divider />
                <UI.components.RaisedButton
                    onSuccess={() =>
                        this.props.dispatch(
                            UI.actions.toggle_create_user_dialog()
                        )
                    }
                    action={Users.actions.create_user(this.state.name)}
                    labels={[
                        Core.i18n.t('create'),
                        Core.i18n.t('creating') + '...',
                        Core.i18n.t('created'),
                        Core.i18n.t('error')
                    ]}
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
