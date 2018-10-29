// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    selected_users: string[];
    selected_groups: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AssignMaterialDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (!this.props.open && nextProps.open) {
            this.props.dispatch(Cards.actions.reset_card_selection());
        }
    }

    public componentWillMount() {
        this.props.dispatch(Cards.actions.get_cards());
    }

    public render() {
        return (
            <Dialog
                title="Gruppen"
                autoScrollBodyContent={true}
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none'
                }}
                actions={[
                    <RaisedButton
                        label="Abbrechen"
                        onClick={() =>
                            this.props.dispatch(
                                UI.actions.toggle_assign_group_dialog()
                            )
                        }
                    />,
                    <UI.components.RaisedButton
                        action={Groups.actions.assign_groups(
                            this.props.selected_users,
                            this.props.selected_groups
                        )}
                        labels={[
                            'Gruppen zuweisen',
                            'Wird zugewiesen...',
                            'Gruppen zugewiesen',
                            'Fehler'
                        ]}
                        disabled={false}
                        fullWidth={false}
                        onSuccess={() => {
                            this.props.dispatch(
                                UI.actions.toggle_assign_group_dialog()
                            );
                            this.props.dispatch(
                                Groups.actions.set_selected_groups([])
                            );
                        }}
                    />
                ]}
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(UI.actions.toggle_assign_group_dialog())
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.ui.show_assign_group_dialog,
        selected_users: state.users.ui.selected_users,
        selected_groups: state.groups.ui.selected_groups
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
)(AssignMaterialDialog);
