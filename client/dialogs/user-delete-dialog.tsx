// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Users from 'lib/users';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    selected_users: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class DeleteUserDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Dialog
                title={Core.i18n.t('user_delete')}
                actions={[
                    <RaisedButton
                        label={Core.i18n.t('cancel')}
                        onClick={() =>
                            this.props.dispatch(
                                UI.actions.toggle_delete_user_dialog()
                            )
                        }
                    />,
                    <UI.components.RaisedButton
                        action={Users.actions.delete_user(
                            this.props.selected_users
                        )}
                        labels={[
                            Core.i18n.t('delete'),
                            Core.i18n.t('deleting'),
                            Core.i18n.t('deleted'),
                            Core.i18n.t('error')
                        ]}
                        disabled={false}
                        fullWidth={false}
                        onSuccess={() => {
                            this.props.dispatch(
                                UI.actions.toggle_delete_user_dialog()
                            );
                            this.props.dispatch(
                                Users.actions.selection_reset()
                            );
                        }}
                    />
                ]}
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(UI.actions.toggle_delete_user_dialog())
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.ui.show_delete_user_dialog,
        selected_users: state.users.ui.selected_users
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
)(DeleteUserDialog);
