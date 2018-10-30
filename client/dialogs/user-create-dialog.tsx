// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton } from 'material-ui';

import CreateUserContainer from 'client/container/user-create-container';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class CreateUserDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Dialog
                title={Core.i18n.t('user_create')}
                actions={[
                    <RaisedButton
                        label={Core.i18n.t('cancel')}
                        onClick={() =>
                            this.props.dispatch(
                                UI.actions.toggle_create_user_dialog()
                            )
                        }
                    />
                ]}
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(UI.actions.toggle_create_user_dialog())
                }
            >
                <CreateUserContainer />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.ui.show_create_user_dialog
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
)(CreateUserDialog);
