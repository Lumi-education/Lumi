// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { List, ListItem, Paper, RaisedButton, Dialog } from 'material-ui';

import SVGCheckBox from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import SVGCheck from 'material-ui/svg-icons/toggle/check-box';

import * as moment from 'moment-timezone';
// local
import { IState } from 'client/state';

// types
import { IData } from 'lib/cards/types';

// actions
import { push, set_appbar_title } from 'lib/ui/actions';

// selectors
import {
    IUserCollection,
    select_collection_for_user
} from 'lib/collections/selectors';

// modules
import * as Grades from 'lib/grades';
import * as Collections from 'lib/collections';
import * as Cards from 'lib/cards';

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    user_id: string;
    collection_id: string;
    collection: IUserCollection;
    data: (card_id: string) => Cards.ICardData;
    cards: (card_ids: string[]) => Cards.ICard[];
    grade: Grades.IGrade;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserCollectionSummary extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (!this.props.collection) {
            return <div>loading</div>;
        }
        const open_cards = this.props.collection.cards
            .map(card_id => (this.props.data(card_id).processed ? 0 : 1))
            .reduce((p, c) => p + c, 0);

        return (
            <div id="collection_summary">
                <Paper>
                    <List>
                        {this.props
                            .cards(this.props.collection.cards)
                            .map((card, i) => (
                                <ListItem
                                    key={card._id}
                                    onClick={() =>
                                        this.props.dispatch(
                                            push(
                                                '/user/collections/' +
                                                    this.props.collection_id +
                                                    '/cards/' +
                                                    card._id
                                            )
                                        )
                                    }
                                    primaryText={i + 1 + '. ' + card.name}
                                    rightIcon={
                                        this.props.data(card._id).processed ? (
                                            <SVGCheck />
                                        ) : (
                                            <SVGCheckBox />
                                        )
                                    }
                                />
                            ))}
                    </List>
                </Paper>
                {this.props.collection.is_graded ? (
                    <Paper style={{ padding: '10px', marginTop: '20px' }}>
                        Dieses Arbeitsblatt ist bewertet.
                    </Paper>
                ) : (
                    <Paper style={{ padding: '10px', marginTop: '20px' }}>
                        Dieses Arbeitsblatt ist nicht bewertet.
                    </Paper>
                )}
                {this.props.collection.auto_complete ? (
                    <Paper style={{ padding: '10px', marginTop: '20px' }}>
                        Dieses Arbeitsblatt wird automatisch (und sofort)
                        ausgewertet.
                    </Paper>
                ) : (
                    <Paper style={{ padding: '10px', marginTop: '20px' }}>
                        Dieses Arbeitsblatt wird vom Lehrer ausgewertet. Du
                        erhälst die Auswertung erst später.
                    </Paper>
                )}
                {this.props.collection.due_date ? (
                    <Paper style={{ padding: '10px', marginTop: '20px' }}>
                        Dieses Arbeitsblatt muss in{' '}
                        {moment(this.props.collection.due_date)
                            .tz('Europe/Berlin')
                            .fromNow()}{' '}
                        abgegeben werden.
                    </Paper>
                ) : null}
                {this.props.grade ? (
                    <Paper style={{ marginTop: '20px' }}>
                        <Grades.container.GradeRef
                            user_id={this.props.user_id}
                            ref_id={this.props.collection_id}
                        />
                    </Paper>
                ) : null}

                {this.props.collection.submitted ? null : (
                    <RaisedButton
                        style={{ marginTop: '20px' }}
                        fullWidth={true}
                        primary={true}
                        label={
                            open_cards === 0
                                ? 'Abgeben'
                                : open_cards + ' offene Karten'
                        }
                        disabled={open_cards !== 0}
                        onClick={() =>
                            this.props.dispatch(
                                Collections.actions.submit_collection(
                                    this.props.collection_id
                                )
                            )
                        }
                    />
                )}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.params.user_id || state.auth.user_id;
    const collection_id = ownProps.params.collection_id;

    return {
        user_id,
        collection_id,
        collection: select_collection_for_user(state, collection_id),
        cards: card_ids => Cards.selectors.select_cards_by_ids(state, card_ids),
        data: card_id =>
            Cards.selectors.select_data(state, user_id, collection_id, card_id),
        grade: Grades.selectors.by_ref(state, user_id, collection_id)
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
)(UserCollectionSummary);
