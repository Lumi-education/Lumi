// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { flatten, uniq } from 'lodash';

// container
// import { GroupsChipInputContainer } from 'client/container';

// components
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {
    // assign_callback: (card_ids: string[]) => void;
}

interface IStateProps extends IPassedProps {
    cards: Cards.ICard[];
    selected_cards: Cards.ICard[];
    selected_tags: string[];
    classes: any;
    search_filter_text: string;
    card: Cards.ICard;
    selected_user_ids: string[];
    selected_group_ids: string[];
    selected_card_ids: string[];
    users_in_group: (group_id: string) => Users.models.User[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    mode: 'create_card' | 'card_list';
}

export class CardsAssignDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            mode: 'card_list'
        };
    }

    public render() {
        const { classes } = this.props;
        return (
            <Dialog
                title={Core.i18n.t('cards_assign', {
                    num: this.props.selected_card_ids.length
                })}
                actions={[<RaisedButton label={Core.i18n.t('cancel')} />]}
                open={false}
            >
                <div style={{ height: '350px' }}>
                    <Typography component="h2">
                        {Core.i18n.t('cards_assign_explanation', {
                            num: this.props.selected_card_ids.length
                        })}
                    </Typography>
                    {Core.i18n.t('groups')}
                    {/* <GroupsChipInputContainer
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
                    /> */}
                    {Core.i18n.t('users')}
                    <Users.components.UserChipInput
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
        // assign_callback: ownProps.assign_callback,
        cards: Cards.selectors.with_tags(state, state.tags.ui.selected_tags),
        selected_cards: Cards.selectors.selected_cards(state),
        selected_card_ids: state.cards.ui.selected_cards,
        selected_tags: state.tags.ui.selected_tags,
        classes: ownProps.classes,
        search_filter_text: state.ui.search_filter_text,
        card: state.cards.ui.card,
        selected_group_ids: state.groups.ui.selected_groups,
        selected_user_ids: state.users.ui.selected_users,
        users_in_group: (group_id: string) =>
            Users.selectors.users_in_group(state, group_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    appBar: {
        position: 'relative'
    },
    flex: {
        flex: 1
    },
    selectedCards: {
        borderLeft: '5px solid #000000'
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(CardsAssignDialog)
);
