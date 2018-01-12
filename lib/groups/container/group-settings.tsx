// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import {
    Dialog,
    TextField,
    SelectField,
    MenuItem,
    RaisedButton
} from 'material-ui';

import { RaisedButtonComponent } from 'lib/ui';

import { state_color } from 'lib/ui/utils';

// local
import { IState } from 'client/state';

// types
import { IGroup } from 'lib/groups';

// actions

import {
    get_group,
    get_groups,
    create_and_add_group
} from 'lib/groups/actions';

// selectors
import { groups_actions, group_selectors } from '../';

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    group: IGroup;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    name?: string;

    show_delete_dialog?: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupSettingsContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: '',

            show_delete_dialog: false
        };

        this.updated_state = this.updated_state.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(get_group(this.props.group_id)).then(res => {
            this.setState({
                name: this.props.group.name
            });
        });
    }

    public updated_state() {
        return {
            name: this.state.name
        };
    }

    public render() {
        if (this.props.group) {
            return (
                <div>
                    <TextField
                        hintText="Name"
                        floatingLabelText="Name"
                        value={this.state.name}
                        fullWidth={true}
                        onChange={(e, name) => this.setState({ name })}
                        errorText={
                            this.props.group.name !== this.state.name
                                ? 'Previous: ' + this.props.group.name
                                : null
                        }
                        errorStyle={{ color: state_color('pending') }}
                    />
                    {this.props.children}
                    <RaisedButton
                        fullWidth={true}
                        label="Back"
                        onClick={() =>
                            this.props.dispatch(push('/admin/groups'))
                        }
                    />
                    <RaisedButtonComponent
                        dispatch={this.props.dispatch}
                        action={groups_actions.update_group(
                            this.props.group._id,
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
                                            groups_actions.delete_group(
                                                this.props.group_id
                                            )
                                        )
                                        .then(res =>
                                            this.props.dispatch(
                                                push('/admin/groups')
                                            )
                                        );
                                }}
                                primary={true}
                                fullWidth={true}
                                label="YES"
                            />
                        ]}
                    >
                        Do you really want to delete {this.props.group.name}?
                    </Dialog>
                </div>
            );
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        group: group_selectors.select_group(state, ownProps.group_id),
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
)(GroupSettingsContainer);
