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

import CreateUserContainer from '../../../container/create-user';

// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    card: Cards.ICard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class CreateCardDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Dialog
                title="Material erstellen"
                autoScrollBodyContent={true}
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none'
                }}
                bodyStyle={{
                    background: 'linear-gradient(90deg, #8e44ad, #3498db)'
                }}
                actions={[
                    <RaisedButton
                        label="Abbrechen"
                        onClick={() =>
                            this.props.dispatch(
                                UI.actions.toggle_create_card_dialog()
                            )
                        }
                    />,
                    <UI.components.RaisedButton
                        action={Cards.actions.create_card(this.props.card)}
                        labels={[
                            'Erstellen',
                            'erstelle...',
                            'Erstellt',
                            'Fehler'
                        ]}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={() => {
                            this.props.dispatch(
                                UI.actions.toggle_create_card_dialog()
                            );
                            this.props.dispatch(Cards.actions.reset_card());
                        }}
                    />
                ]}
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(UI.actions.toggle_create_card_dialog())
                }
            >
                <Cards.CardEdit />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.ui.show_create_card_dialog,
        card: state.cards.ui.card
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
)(CreateCardDialog);
