// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { RaisedButton } from 'material-ui';
import ErrorBoundary from 'client/pages/error-boundary';

// local
import { IState } from 'client/state';

// modules
import * as Tags from 'lib/tags';
import * as Cards from 'lib/cards';
import * as UI from 'lib/ui';

interface IStateProps {
    card_id: string;
    card: Cards.ICard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading: string;
    loading_step: number;
}
interface IProps extends IStateProps, IDispatchProps {}

export class CardPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Karte', loading_step: 1 });
        this.props
            .dispatch(Cards.actions.get_cards([this.props.card_id]))
            .then(res => {
                this.props.dispatch(Cards.actions.change_card(res.payload[0]));
                this.setState({ loading: 'finished', loading_step: 2 });
            });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={0}
                    max={2}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        return (
            <div>
                <ErrorBoundary>
                    <Cards.CardEdit>
                        <Tags.TagInputContainer
                            tag_ids={this.props.card.tags}
                            doc_id={this.props.card._id}
                        />
                    </Cards.CardEdit>
                </ErrorBoundary>
                <UI.components.ActionBar>
                    <RaisedButton
                        label="Abbrechen"
                        onClick={() => this.props.dispatch(UI.actions.goBack())}
                    />
                    <UI.components.RaisedButton
                        action={Cards.actions.delete_card(this.props.card_id)}
                        labels={['Löschen', 'lösche...', 'gelöscht', 'Fehler']}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={res => {
                            this.props.dispatch(
                                UI.actions.push('/admin/cards/')
                            );
                            this.props.dispatch(
                                UI.actions.snackbar_open('Karte gelöscht')
                            );
                        }}
                    />
                    <UI.components.RaisedButton
                        action={Cards.actions.duplicate(this.props.card_id)}
                        labels={[
                            'Duplizieren',
                            'dupliziere...',
                            'Dupliziert',
                            'Fehler'
                        ]}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={res => {
                            this.props.dispatch(
                                UI.actions.push(
                                    '/admin/cards/' + res.payload._id
                                )
                            );
                            this.props.dispatch(
                                UI.actions.snackbar_open(
                                    'Karte erfolgreich dupliziert'
                                )
                            );
                        }}
                    />
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
                    />
                </UI.components.ActionBar>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const card_id = ownProps.match.params.card_id;
    return {
        card_id,
        card: state.cards.ui.card
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(CardPage);
