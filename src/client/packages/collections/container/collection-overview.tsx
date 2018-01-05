// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import { noop } from 'lodash';

import { Map } from 'immutable';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip';

import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SVGLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FilterBar from 'client/packages/ui/components/filter-bar';
import SVGAssignmentReturn from 'material-ui/svg-icons/action/assignment-return';
import SVGCorrect from 'material-ui/svg-icons/action/done';
import SVGWrong from 'material-ui/svg-icons/navigation/close';

import { get_grade_color } from 'client/style/utils';
// local
import { IState } from 'client/state';

// types
import { ICollection } from 'common/types';
import { ICard } from 'client/packages/cards/types';

// container
import { CollectionEvaluationContainer } from 'client/packages/collections';
// selectors
import { select_cards_by_ids } from 'client/packages/cards/selectors';
import { select_collection_by_id } from 'client/packages/collections/selectors';
import {
    select_collection,
    select_data_as_map
} from 'client/packages/data/selectors';
// actions
import { get_collection } from 'client/packages/collections/actions';

import {
    create_data,
    update_data,
    get_data
} from 'client/packages/data/actions';

interface IPassedProps {
    collection_id: string;
    onListClick?: (id: string) => void;
}

interface IStateProps extends IPassedProps {
    collection: ICollection;
    cards: ICard[];
    data;
    card_data: Map<string, any>;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
}

export class CollectionOverviewContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <div>
                <List>
                    {this.props.cards.map((card, i) => (
                        <div key={card._id}>
                            <ListItem
                                leftAvatar={<Avatar>{i + 1}</Avatar>}
                                primaryText={card.name}
                                onClick={() => {
                                    this.props.dispatch(
                                        push(
                                            '/user/collections/' +
                                                this.props.collection._id +
                                                '/cards/' +
                                                card._id
                                        )
                                    );
                                    this.props.onListClick
                                        ? this.props.onListClick(card._id)
                                        : noop();
                                }}
                                rightIcon={
                                    this.props.data.submitted ? (
                                        (
                                            this.props.card_data
                                                .toArray()
                                                .filter(
                                                    data =>
                                                        data.collection_id ===
                                                            this.props
                                                                .collection_id &&
                                                        data.card_id ===
                                                            card._id &&
                                                        data.data_type ===
                                                            'card'
                                                )[0] || {}
                                        ).score > 0 ? (
                                            <SVGCorrect />
                                        ) : (
                                            <SVGWrong />
                                        )
                                    ) : null
                                }
                            />
                            <Divider inset={true} />
                        </div>
                    ))}
                </List>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection: select_collection_by_id(state, ownProps.collection_id),
        collection_id: ownProps.collection_id,
        cards: select_cards_by_ids(
            state,
            select_collection_by_id(state, ownProps.collection_id).cards
        ),
        card_data: select_data_as_map(state),
        data: select_collection(state, ownProps.collection_id),
        onListClick: ownProps.onListClick
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
)(CollectionOverviewContainer);
