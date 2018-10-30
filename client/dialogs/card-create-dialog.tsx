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
                        ? Core.i18n.t('card_edit', {
                              name: this.props.card.name
                          })
                        : Core.i18n.t('card_create')
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
                        label={Core.i18n.t('cancel')}
                        onClick={() =>
                            this.props.dispatch(
                                UI.actions.toggle_create_card_dialog()
                            )
                        }
                    />,
                    this.props.card._id ? (
                        <RaisedButton
                            label={Core.i18n.t('duplicate')}
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
                                      Core.i18n.t('save'),
                                      Core.i18n.t('saving'),
                                      Core.i18n.t('saved'),
                                      Core.i18n.t('error')
                                  ]
                                : [
                                      Core.i18n.t('create'),
                                      Core.i18n.t('creating'),
                                      Core.i18n.t('created'),
                                      Core.i18n.t('error')
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
