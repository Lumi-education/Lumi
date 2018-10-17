// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { intersection } from 'lodash';

// components
import {
    AutoComplete,
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

import ChipInput from 'material-ui-chip-input';

import CardsContainer from '../../../container/cards';
// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';
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
    selected_groups: Groups.IGroup[];

    user_ids: string[];
    cards: Cards.ICard[];
    selected_card_ids: string[];
    selected_cards: Cards.ICard[];
    selected_tags: string[];
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

    public componentWillReceiveProps(nextProps: IProps) {
        if (!this.props.open && nextProps.open) {
            // this.props.dispatch(Cards.actions.reset_card_selection());
        }
    }

    public componentWillMount() {
        this.props.dispatch(Cards.actions.get_cards());
        this.props.dispatch(Groups.actions.get_groups());
    }

    public render() {
        return (
            <Dialog
                title="Material"
                autoScrollBodyContent={true}
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none'
                }}
                actions={[
                    <RaisedButton
                        label="Abbrechen"
                        onClick={() =>
                            this.props.dispatch(
                                UI.actions.toggle_assign_material_dialog()
                            )
                        }
                    />,
                    <UI.components.RaisedButton
                        labels={[
                            this.props.selected_card_ids.length + ' zuweisen',
                            'wird zugewiesen...',
                            'erfolgreich zugewiesen',
                            'Fehler'
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
                <ChipInput
                    hintText={'Gruppen'}
                    floatingLabelText="Gruppen"
                    fullWidth={true}
                    value={this.props.selected_groups}
                    allowDuplicates={false}
                    dataSource={this.props.groups}
                    dataSourceConfig={{
                        text: 'name',
                        value: '_id'
                    }}
                    openOnFocus={true}
                    filter={AutoComplete.fuzzyFilter}
                    onRequestAdd={group => {
                        if (group._id) {
                            this.props.dispatch(
                                Groups.actions.set_selected_groups([group._id])
                            );

                            this.props.dispatch(
                                Users.actions.set_selected_users(group.members)
                            );
                        }
                    }}
                    onRequestDelete={group_id => {
                        this.props.dispatch(
                            Groups.actions.select_group(group_id)
                        );
                    }}
                />
                <Users.container.ChipInput />
                <CardsContainer />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.ui.show_assign_material_dialog,
        groups: state.groups.list,
        selected_groups: Groups.selectors.selected_groups(state),
        user_ids: state.users.ui.selected_users,
        card_ids: state.cards.ui.selected_cards,
        selected_card_ids: state.cards.ui.selected_cards,
        selected_cards: Cards.selectors.select_cards_by_ids(
            state,
            state.cards.ui.selected_cards
        ),
        cards: state.cards.list,
        selected_tags: state.tags.ui.selected_tags
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
