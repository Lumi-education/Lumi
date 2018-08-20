// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import {
    Dialog,
    RaisedButton,
    FloatingActionButton,
    List,
    ListItem,
    Card,
    CardActions,
    CardHeader,
    CardText,
    FlatButton
} from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Flow from 'lib/flow';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    card: (card_id: string) => Cards.ICard;
    assignment: Flow.IAssignment;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AssignmentDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Dialog
                title="Aufgabe"
                autoScrollBodyContent={true}
                bodyStyle={{
                    background: UI.config.default_bg
                }}
                actions={[
                    <RaisedButton
                        label="Abbrechen"
                        onClick={() =>
                            this.props.dispatch(Flow.actions.toggle_dialog())
                        }
                    />,
                    <UI.components.RaisedButton
                        action={Flow.actions.update_assignments(
                            [this.props.assignment._id],
                            { completed: true }
                        )}
                        labels={[
                            'Abschließen',
                            'wird abgeschlossen...',
                            'abgeschlossen',
                            'Fehler'
                        ]}
                        fullWidth={false}
                        disabled={false}
                    />,
                    <UI.components.RaisedButton
                        action={Flow.actions.delete_assignments([
                            this.props.assignment._id
                        ])}
                        labels={['Löschen', 'lösche...', 'Gelöscht', 'Fehler']}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={() => {
                            this.props.dispatch(Flow.actions.toggle_dialog());
                            this.props.dispatch(
                                Flow.actions.reset_assignment()
                            );
                        }}
                    />,
                    <UI.components.RaisedButton
                        action={Flow.actions.update_assignments(
                            [this.props.assignment._id],
                            this.props.assignment
                        )}
                        labels={[
                            'Speichern',
                            'Speichere...',
                            'Gespeichert',
                            'Fehler'
                        ]}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={() => {
                            this.props.dispatch(Flow.actions.toggle_dialog());
                            this.props.dispatch(
                                Flow.actions.reset_assignment()
                            );
                        }}
                    />
                ]}
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(Flow.actions.toggle_dialog())
                }
            >
                <Cards.CardViewContainer
                    card_id={this.props.assignment.card_id}
                    assignment_id={this.props.assignment._id}
                />
                <Flow.container.AssignmentEdit />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.flow.ui.show_dialog,
        assignment: state.flow.ui.assignment,
        card: (card_id: string) => Cards.selectors.select_card(state, card_id)
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
)(AssignmentDialog);
