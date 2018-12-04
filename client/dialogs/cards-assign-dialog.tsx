// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { flatten, uniq } from 'lodash';
// container
import {
    CardsContainer,
    GroupsChipInputContainer,
    UsersChipInputContainer,
    TagsChipInputContainer
} from 'client/container';

// import { CardList, Card } from 'client/components';

// components

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItem from '@material-ui/core/ListItem';
// import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
// import Paper from '@material-ui/core/Paper';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Grid from '@material-ui/core/Grid';
// import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import CloseIcon from '@material-ui/icons/Close';
// import Slide from '@material-ui/core/Slide';
// import TextField from '@material-ui/core/TextField';
// import SearchIcon from '@material-ui/icons/Search';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as Flow from 'lib/flow';
import * as Groups from 'lib/groups';
import * as Tags from 'lib/tags';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {
    // assign_callback: (card_ids: string[]) => void;
}

interface IStateProps extends IPassedProps {
    open: boolean;
    cards: Cards.ICard[];
    selected_cards: Cards.ICard[];
    selected_tags: string[];
    classes: any;
    search_filter_text: string;
    card: Cards.ICard;
    selected_user_ids: string[];
    selected_group_ids: string[];
    selected_card_ids: string[];
    users_in_group: (group_id: string) => Users.IUser[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    mode: 'create_card' | 'card_list';
}

// function Transition(props) {
//     return <Slide direction="up" {...props} />;
// }

export class CardsAssignDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            mode: 'card_list'
        };

        this.handleClose = this.handleClose.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(Cards.actions.get_cards());
    }

    public handleClose() {
        this.props.dispatch(UI.actions.toggle_assign_material_dialog());
    }

    public render() {
        const { classes } = this.props;
        return (
            // <Dialog
            //     fullScreen={true}
            //     open={this.props.open}
            //     onClose={this.handleClose}
            //     TransitionComponent={Transition}
            // >
            //     <AppBar className={classes.appBar}>
            //         <Toolbar>
            //             <IconButton
            //                 color="inherit"
            //                 onClick={this.handleClose}
            //                 aria-label="Close"
            //             >
            //                 <CloseIcon />
            //             </IconButton>
            //             <Typography
            //                 variant="h6"
            //                 color="inherit"
            //                 className={classes.flex}
            //             >
            //                 {Core.i18n.t('assign.cards')}
            //             </Typography>
            //             {this.state.mode === 'card_list' ? (
            //                 <Button
            //                     color="inherit"
            //                     onClick={() => {
            //                         this.props.assign_callback(
            //                             this.props.selected_card_ids
            //                         );
            //                         this.handleClose();
            //                     }}
            //                 >
            //                     Save
            //                 </Button>
            //             ) : null}
            //         </Toolbar>
            //     </AppBar>
            //     {this.state.mode === 'card_list' ? (
            //         <Grid container={true} spacing={24}>
            //             <Grid item={true} xs={6}>
            //                 <Paper>
            //                     <TextField
            //                         id="standard-name"
            //                         label={Core.i18n.t('search')}
            //                         className={classes.textField}
            //                         value={this.props.search_filter_text}
            //                         onChange={e =>
            //                             this.props.dispatch(
            //                                 UI.actions.set_search_filter(
            //                                     e.target.value
            //                                 )
            //                             )
            //                         }
            //                         margin="normal"
            //                         fullWidth={true}
            //                     />
            //                     <TagsChipInputContainer
            //                         tag_ids={this.props.selected_tags}
            //                         onChange={tag_ids =>
            //                             this.props.dispatch(
            //                                 Tags.actions.set_selected_tags(
            //                                     tag_ids
            //                                 )
            //                             )
            //                         }
            //                     />
            //                 </Paper>
            //                 <Button
            //                     variant="outlined"
            //                     color="primary"
            //                     className={classes.button}
            //                     fullWidth={true}
            //                     onClick={() => {
            //                         this.props
            //                             .dispatch(Cards.actions.create_card())
            //                             .then(res => {
            //                                 this.props.dispatch(
            //                                     Cards.actions.change_card(
            //                                         res.payload
            //                                     )
            //                                 );
            //                                 this.props.dispatch(
            //                                     Cards.actions.select_card(
            //                                         res.payload._id
            //                                     )
            //                                 );
            //                                 this.setState({
            //                                     mode: 'create_card'
            //                                 });
            //                             });
            //                     }}
            //                 >
            //                     {Core.i18n.t('card_create')}
            //                 </Button>
            //                 (
            //                 <Paper>
            //                     {this.props.cards
            //                         .filter(
            //                             card =>
            //                                 this.props.selected_card_ids.indexOf(
            //                                     card._id
            //                                 ) === -1
            //                         )
            //                         .filter(
            //                             card =>
            //                                 card.name
            //                                     .toLowerCase()
            //                                     .indexOf(
            //                                         this.props.search_filter_text.toLowerCase()
            //                                     ) > -1
            //                         )
            //                         .slice(0, 20)
            //                         .map(card => (
            //                             <Card
            //                                 key={card._id}
            //                                 card={card}
            //                                 selected={
            //                                     this.props.selected_card_ids.indexOf(
            //                                         card._id
            //                                     ) > -1
            //                                 }
            //                                 select={() =>
            //                                     this.props.dispatch(
            //                                         Cards.actions.select_card(
            //                                             card._id
            //                                         )
            //                                     )
            //                                 }
            //                                 view={() =>
            //                                     this.props.dispatch(
            //                                         Cards.actions.change_card(
            //                                             card
            //                                         )
            //                                     )
            //                                 }
            //                             />
            //                         ))}
            //                 </Paper>
            //                 )
            //             </Grid>
            //             <Grid item={true} xs={3}>
            //                 <Cards.components.CardPreview
            //                     card={this.props.card}
            //                 />
            //             </Grid>
            //             <Grid
            //                 item={true}
            //                 xs={3}
            //                 className={classes.selectedCards}
            //             >
            //                 <Typography variant="h5" component="h3">
            //                     {Core.i18n.t('selected_cards')}
            //                 </Typography>
            //                 <Paper>
            //                     <div
            //                         style={{
            //                             display: 'flex',
            //                             flexDirection: 'row',
            //                             flexWrap: 'wrap'
            //                         }}
            //                     >
            //                         {this.props.selected_cards.map(card => (
            //                             <Card
            //                                 key={card._id}
            //                                 card={card}
            //                                 selected={
            //                                     this.props.selected_card_ids.indexOf(
            //                                         card._id
            //                                     ) > -1
            //                                 }
            //                                 select={() =>
            //                                     this.props.dispatch(
            //                                         Cards.actions.select_card(
            //                                             card._id
            //                                         )
            //                                     )
            //                                 }
            //                                 view={() =>
            //                                     this.props.dispatch(
            //                                         Cards.actions.change_card(
            //                                             card
            //                                         )
            //                                     )
            //                                 }
            //                             />
            //                         ))}
            //                     </div>
            //                 </Paper>
            //             </Grid>
            //         </Grid>
            //     ) : (
            //         <div>
            //             <Cards.CardEdit>
            //                 <TagsChipInputContainer
            //                     tag_ids={this.props.card.tags}
            //                     onChange={tag_ids =>
            //                         this.props.dispatch(
            //                             Cards.actions.change_card({
            //                                 tags: tag_ids
            //                             })
            //                         )
            //                     }
            //                 />
            //             </Cards.CardEdit>
            //             <UI.components.RaisedButton
            //                 action={Cards.actions.delete_card(
            //                     this.props.card._id
            //                 )}
            //                 labels={[
            //                     Core.i18n.t('delete'),
            //                     Core.i18n.t('deleting'),
            //                     Core.i18n.t('deleted'),
            //                     Core.i18n.t('error')
            //                 ]}
            //                 fullWidth={false}
            //                 disabled={false}
            //                 onSuccess={() =>
            //                     this.setState({ mode: 'card_list' })
            //                 }
            //             />
            //             <UI.components.RaisedButton
            //                 action={
            //                     this.props.card._id
            //                         ? Cards.actions.update_card(
            //                               this.props.card._id,
            //                               this.props.card
            //                           )
            //                         : Cards.actions.create_card(this.props.card)
            //                 }
            //                 labels={
            //                     this.props.card._id
            //                         ? [
            //                               Core.i18n.t('save'),
            //                               Core.i18n.t('saving'),
            //                               Core.i18n.t('saved'),
            //                               Core.i18n.t('error')
            //                           ]
            //                         : [
            //                               Core.i18n.t('create'),
            //                               Core.i18n.t('creating'),
            //                               Core.i18n.t('created'),
            //                               Core.i18n.t('error')
            //                           ]
            //                 }
            //                 fullWidth={false}
            //                 disabled={false}
            //                 onSuccess={() =>
            //                     this.setState({ mode: 'card_list' })
            //                 }
            //             />
            //         </div>
            //     )}
            // </Dialog>
            <Dialog
                title={Core.i18n.t('cards_assign', {
                    num: this.props.selected_card_ids.length
                })}
                // contentStyle={{
                //     minHeight: '500px'
                // }}
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
                            this.props.selected_user_ids,
                            this.props.selected_card_ids
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
                    <Typography component="h2">
                        {Core.i18n.t('cards_assign_explanation', {
                            num: this.props.selected_card_ids.length
                        })}
                    </Typography>
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
        // assign_callback: ownProps.assign_callback,
        cards: Cards.selectors.with_tags(state, state.tags.ui.selected_tags),
        selected_cards: Cards.selectors.selected_cards(state),
        open: state.ui.show_assign_material_dialog,
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
