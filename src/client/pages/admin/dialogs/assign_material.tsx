// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { intersection } from 'lodash';

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

// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';
import * as Flow from 'lib/flow';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {
    user_ids?: string[];
}

interface IStateProps extends IPassedProps {
    open: boolean;
    card_ids: string[];
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
                <Users.container.ChipInput />
                <div
                    style={{
                        display: 'flex'
                    }}
                >
                    <div
                        style={{
                            width: '50%'
                        }}
                    >
                        Material suchen
                        <Tags.TagsFilterContainer />
                        {this.props.cards
                            .filter(
                                card =>
                                    this.props.selected_card_ids.indexOf(
                                        card._id
                                    ) === -1
                            )
                            .filter(
                                card =>
                                    intersection(
                                        card.tags,
                                        this.props.selected_tags
                                    ).length === this.props.selected_tags.length
                            )
                            .map(card => (
                                <Card key={card._id} style={{ margin: '10px' }}>
                                    <CardHeader
                                        title={card.name}
                                        subtitle={
                                            <Tags.TagsContainer
                                                tag_ids={card.tags}
                                            />
                                        }
                                        showExpandableButton={true}
                                        actAsExpander={true}
                                    />
                                    <CardActions>
                                        <FlatButton
                                            backgroundColor="#1abc9c"
                                            label="Hinzufügen"
                                            onClick={() =>
                                                this.props.dispatch(
                                                    Cards.actions.select_card(
                                                        card._id
                                                    )
                                                )
                                            }
                                        />
                                    </CardActions>
                                    <CardText expandable={true}>
                                        {card.text}
                                    </CardText>
                                </Card>
                            ))}
                    </div>
                    <div style={{ width: '50%' }}>
                        Material zuweisen
                        <List>
                            {this.props.selected_cards.map(card => (
                                <Card style={{ margin: '10px' }}>
                                    <CardHeader
                                        title={card.name}
                                        subtitle={
                                            <Tags.TagsContainer
                                                tag_ids={card.tags}
                                            />
                                        }
                                        showExpandableButton={true}
                                        actAsExpander={true}
                                    />
                                    <CardActions>
                                        <FlatButton
                                            backgroundColor="#c0392b"
                                            label="Entfernen"
                                            onClick={() =>
                                                this.props.dispatch(
                                                    Cards.actions.select_card(
                                                        card._id
                                                    )
                                                )
                                            }
                                        />
                                    </CardActions>
                                    <CardText expandable={true}>
                                        {card.text}
                                    </CardText>
                                </Card>
                            ))}
                        </List>{' '}
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.ui.show_assign_material_dialog,
        user_ids: state.users.ui.selected_users,
        card_ids: state.cards.ui.selected_cards,
        selected_card_ids: state.cards.ui.selected_cards,
        selected_cards: Cards.selectors.select_cards_by_ids(
            state,
            state.cards.ui.selected_cards
        ),
        cards: state.cards.map.toArray(),
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
