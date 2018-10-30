// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import { Dialog, TextField, RaisedButton } from 'material-ui';

import { state_color } from 'lib/ui/utils';

// modules
import * as Core from 'lib/core';
import * as Groups from '..';

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    group: Groups.IGroup;
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
        this.props
            .dispatch(Groups.actions.get_group(this.props.group_id))
            .then(res => {
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
                        hintText={Core.i18n.t('name')}
                        floatingLabelText={Core.i18n.t('name')}
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
                        label={Core.i18n.t('back')}
                        onClick={() =>
                            this.props.dispatch(push('/admin/groups'))
                        }
                    />
                    <RaisedButton
                        fullWidth={true}
                        secondary={true}
                        onClick={() =>
                            this.setState({ show_delete_dialog: true })
                        }
                        label={Core.i18n.t('delete')}
                    />

                    <Dialog
                        open={this.state.show_delete_dialog}
                        onRequestClose={() =>
                            this.setState({ show_delete_dialog: false })
                        }
                        title={Core.i18n.t('delete_', {
                            item: Core.i18n.t('group')
                        })}
                        actions={[
                            <RaisedButton
                                onClick={() =>
                                    this.setState({ show_delete_dialog: false })
                                }
                                secondary={true}
                                fullWidth={true}
                                label={Core.i18n.t('cancel')}
                            />,
                            <RaisedButton
                                onClick={() => {
                                    this.props
                                        .dispatch(
                                            Groups.actions.delete_group(
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
                                label={Core.i18n.t('delete')}
                            />
                        ]}
                    >
                        {Core.i18n.t('delete_', {
                            item: this.props.group.name
                        })}
                        ?
                    </Dialog>
                </div>
            );
        }

        return <div>{Core.i18n.t('loading')}</div>;
    }
}

function mapStateToProps(state: Groups.IState, ownProps): IStateProps {
    return {
        group: Groups.selectors.select_group(state, ownProps.group_id),
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
