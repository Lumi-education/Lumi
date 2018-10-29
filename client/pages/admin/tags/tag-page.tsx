// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import { Tabs, Tab } from 'material-ui/Tabs';

// types
import * as UI from 'lib/ui';
import { IState } from 'client/state';

// import GroupUsersTab from './group-users-tab';
import * as Core from 'lib/core';
import * as Tags from 'lib/tags';
import * as Cards from 'lib/cards';

import { RaisedButton } from 'material-ui';

interface IStateProps {
    tag_id: string;
    tab: string;
    tag: Tags.ITag;
    updated_tag: Tags.ITag;
    cards: Cards.ICard[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminTag extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false
        };
    }

    public componentWillMount() {
        this.props.dispatch(
            Core.actions.find(
                { type: 'card', tags: { $in: [this.props.tag_id] } },
                {}
            )
        );
        this.props.dispatch(Tags.actions.get_tags()).then(res => {
            this.props.dispatch(Tags.actions.change_tag(this.props.tag));
        });
    }

    public render() {
        if (!this.props.tag._id) {
            return (
                <UI.components.LoadingPage>Lade Tag</UI.components.LoadingPage>
            );
        }

        return (
            <div>
                <Tabs
                    style={{
                        backgroundColor: '#FFFFFF',
                        zIndex: 1099,
                        width: '100%'
                    }}
                    tabItemContainerStyle={{
                        background: UI.config.gradient_bg
                    }}
                    value={this.props.tab}
                >
                    <Tab
                        label="Settings"
                        value="settings"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/tags/' +
                                        this.props.tag_id +
                                        '/settings'
                                )
                            )
                        }
                    />
                    <Tab
                        label="Karten"
                        value="cards"
                        onActive={() =>
                            this.props.dispatch(
                                push(
                                    '/admin/tags/' +
                                        this.props.tag_id +
                                        '/cards'
                                )
                            )
                        }
                    />
                </Tabs>
                {(() => {
                    switch (this.props.tab) {
                        case 'settings':
                        default:
                            return (
                                <div>
                                    {' '}
                                    <Tags.TagEditContainer />
                                    <UI.components.ActionBar>
                                        <RaisedButton
                                            label="Zurück"
                                            onClick={() =>
                                                this.props.dispatch(
                                                    push('/admin/tags')
                                                )
                                            }
                                        />
                                        <UI.components.RaisedButton
                                            action={Tags.actions.delete_tag(
                                                this.props.tag_id
                                            )}
                                            labels={[
                                                'Löschen',
                                                'lösche...',
                                                'gelöscht',
                                                'Fehler'
                                            ]}
                                            disabled={false}
                                            fullWidth={false}
                                            onSuccess={() =>
                                                this.props.dispatch(
                                                    UI.actions.push(
                                                        '/admin/tags'
                                                    )
                                                )
                                            }
                                        />
                                        <UI.components.RaisedButton
                                            action={Tags.actions.update_tag(
                                                this.props.tag_id,
                                                this.props.updated_tag
                                            )}
                                            labels={[
                                                'Speichern',
                                                'speichere...',
                                                'gepspeichert',
                                                'Fehler'
                                            ]}
                                            disabled={false}
                                            fullWidth={false}
                                        />
                                    </UI.components.ActionBar>
                                </div>
                            );
                        case 'cards':
                            return (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    {this.props.cards
                                        .sort(Core.utils.alphabetically)
                                        .map(card => (
                                            <Cards.components.Card
                                                key={card._id}
                                                onClick={() =>
                                                    this.props.dispatch(
                                                        Cards.actions.select_card(
                                                            card._id
                                                        )
                                                    )
                                                }
                                                selected={false}
                                                card={card}
                                                edit={event => {
                                                    event.preventDefault();
                                                    this.props.dispatch(
                                                        Cards.actions.change_card(
                                                            card
                                                        )
                                                    );
                                                    this.props.dispatch(
                                                        UI.actions.toggle_create_card_dialog()
                                                    );
                                                }}
                                            />
                                        ))}
                                </div>
                            );
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const tag_id = ownProps.match.params.tag_id;
    return {
        tag_id,
        tag: Tags.selectors.tag(state, tag_id),
        updated_tag: state.tags.ui.tag,
        tab: ownProps.match.params.tab,
        cards: Cards.selectors.with_tags(state, [tag_id])
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
)(AdminTag);
