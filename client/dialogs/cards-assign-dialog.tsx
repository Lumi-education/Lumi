// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { flatten, uniq } from 'lodash';
// container
import {
    CardsContainer,
    GroupsChipInputContainer,
    UsersChipInputContainer
} from 'client/container';

// components
import { Dialog, RaisedButton } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as Flow from 'lib/flow';
import * as Groups from 'lib/groups';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {
    user_ids?: string[];
}

interface IStateProps extends IPassedProps {
    open: boolean;
    card_ids: string[];
    groups: Groups.IGroup[];
    selected_group_ids: string[];

    user_ids: string[];
    cards: Cards.ICard[];
    selected_card_ids: string[];
    selected_cards: Cards.ICard[];
    selected_tags: string[];

    users_in_group: (group_id: string) => Users.IUser[];

    selected_user_ids: string[];
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

    public componentWillMount() {
        this.props.dispatch(Cards.actions.get_cards());
        this.props.dispatch(Groups.actions.get_groups());
    }

    public render() {
        return (
            <Dialog
                title={Core.i18n.t('cards')}
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none',
                    minHeight: '500px'
                }}

                actions={[
                    <RaisedButton
                        label={Core.i18n.t('cancel')}
                        onClick={() =>
                            this.props.dispatch(
                                UI.actions.toggle_assign_material_dialog()
                            )
                        }
                    />,
                    <UI.components.RaisedButton
                        labels={[
                            Core.i18n.t('assign.cards', {
                                num: this.props.selected_card_ids.length
                            }),
                            Core.i18n.t('assigning'),
                            Core.i18n.t('assigned'),
                            Core.i18n.t('error')
                        ]}
                        action={Flow.actions.assign(
                            this.props.user_ids,
                            this.props.card_ids
                        )}
                        onSuccess={() => {
                            this.props.dispatch(
                                UI.actions.toggle_assign_material_dialog()
                            );
                            this.props.dispatch(
                                Cards.actions.reset_card_selection()
                            );
                        }}
                        fullWidth={false}
                        disabled={false}
                    />
                ]}
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(
                        UI.actions.toggle_assign_material_dialog()
                    )
                }
            >
                <div style={{ height: '350px' }}>
                    {Core.i18n.t('groups')}
                    <GroupsChipInputContainer
                        group_ids={this.props.selected_group_ids}
                        onChange={(group_ids: string[]) => {
                            this.props.dispatch(
                                Groups.actions.set_selected_groups(group_ids)
                            );
                            const user_ids = uniq(
                                flatten(
                                    group_ids.map(group_id =>
                                        this.props
                                            .users_in_group(group_id)
                                            .map(user => user._id)
                                    )
                                )
                            );
                            this.props.dispatch(
                                Users.actions.set_selected_users(user_ids)
                            );
                        }}
                    />
                    {Core.i18n.t('users')}
                    <UsersChipInputContainer
                        user_ids={this.props.selected_user_ids}
                        onChange={(user_ids: string[]) =>
                            this.props.dispatch(
                                Users.actions.set_selected_users(user_ids)
                            )
                        }
                    />
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.ui.show_assign_material_dialog,
        groups: state.groups.list,
        selected_group_ids: Groups.selectors.selected_group_ids(state),
        users_in_group: (group_id: string) =>
            Users.selectors.users_in_group(state, group_id),
        user_ids: state.users.ui.selected_users,
        card_ids: state.cards.ui.selected_cards,
        selected_card_ids: state.cards.ui.selected_cards,
        selected_cards: Cards.selectors.select_cards_by_ids(
            state,
            state.cards.ui.selected_cards
        ),
        cards: state.cards.list,
        selected_tags: state.tags.ui.selected_tags,
        selected_user_ids: state.users.ui.selected_users
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
