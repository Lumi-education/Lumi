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
import * as Tags from 'lib/tags';

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
                title={
                    this.props.card._id
                        ? this.props.card.name + ' bearbeiten'
                        : 'Material erstellen'
                }
                autoScrollBodyContent={true}
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none'
                }}
                bodyStyle={{
                    background: UI.config.default_bg
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
                    this.props.card._id ? (
                        <RaisedButton
                            label="Duplizieren"
                            onClick={() =>
                                this.props.dispatch(
                                    Cards.actions.change_card({
                                        _id: undefined
                                    })
                                )
                            }
                        />
                    ) : null,
                    <UI.components.RaisedButton
                        action={
                            this.props.card._id
                                ? Cards.actions.update_card(
                                      this.props.card._id,
                                      this.props.card
                                  )
                                : Cards.actions.create_card(this.props.card)
                        }
                        labels={
                            this.props.card._id
                                ? [
                                      'Speichern',
                                      'Speichere...',
                                      'Gespeichert',
                                      'Fehler'
                                  ]
                                : [
                                      'Erstellen',
                                      'erstelle...',
                                      'Erstellt',
                                      'Fehler'
                                  ]
                        }
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
                <Cards.CardEdit>
                    {/* <Tags.TagInputContainer
                        tag_ids={this.props.card.tags}
                        doc_id={this.props.card._id}
                    /> */}
                </Cards.CardEdit>
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
