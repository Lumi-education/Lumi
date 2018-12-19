// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { RaisedButton } from 'material-ui';
import ErrorBoundary from 'client/pages/error-boundary';

// container
import { TagsChipInputContainer } from 'client/container';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
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
        this.props.dispatch(
            Cards.actions.change_card(this.props.card_in_state)
        );
    }

    public render() {
        return <div id="card-page" />;
    }

        return (
            <div>
                <ErrorBoundary>
                    <Cards.CardEdit>
                        <TagsChipInputContainer
                            tag_ids={this.props.card.tags}
                            onChange={tag_ids =>
                                this.props.dispatch(
                                    Cards.actions.change_card({ tags: tag_ids })
                                )
                            }
                        />
                    </Cards.CardEdit>
                </ErrorBoundary>
                <UI.components.ActionBar>
                    <RaisedButton
                        label={Core.i18n.t('cancel')}
                        onClick={() => this.props.dispatch(UI.actions.goBack())}
                    />
                    <UI.components.RaisedButton
                        action={Cards.actions.delete_card(this.props.card_id)}
                        labels={[
                            Core.i18n.t('delete'),
                            Core.i18n.t('deleting'),
                            Core.i18n.t('deleted'),
                            Core.i18n.t('error')
                        ]}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={res => {
                            this.props.dispatch(
                                UI.actions.push('/admin/cards/')
                            );
                        }}
                    />
                    <UI.components.RaisedButton
                        action={Cards.actions.duplicate(this.props.card_id)}
                        labels={[
                            Core.i18n.t('duplicate'),
                            Core.i18n.t('duplicating'),
                            Core.i18n.t('duplicated'),
                            Core.i18n.t('error')
                        ]}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={res => {
                            this.props.dispatch(
                                UI.actions.push(
                                    '/admin/cards/' + res.payload._id
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
