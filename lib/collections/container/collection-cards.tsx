// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import { Map } from 'immutable';

// components
import CollectionCardsAdminComponent from '../components/collection-cards';

// local
import { IState } from 'client/state';

// types
import { ICard } from 'lib/cards/types';
import { ICollection } from '../types';

// selectors
import { select_cards_as_map } from 'lib/cards/selectors';
import { select_collection_by_id } from 'lib/collections/selectors';

// actions
import {
    get_collection,
    update_collection
} from 'lib/collections/actions';

import { Dialog } from 'material-ui';

interface IPassedProps {
    collection_id: string;
}
interface IStateProps extends IPassedProps {
    collection: ICollection;
    cards: Map<string, ICard>;
}

interface IDispatchProps {
    dispatch: (action) => void;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    show_dialog: boolean;
}

export class AdminCollectionCards extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_dialog: false
        };
    }

    public render() {
        return (
            <CollectionCardsAdminComponent
                update_cards_order={(new_order: string[]) =>
                    this.props.dispatch(
                        update_collection(this.props.collection_id, {
                            cards: new_order
                        })
                    )
                }
                cards={this.props.collection.cards.map(card_id =>
                    this.props.cards.get(card_id)
                )}
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_id: ownProps.collection_id,
        collection: select_collection_by_id(state, ownProps.collection_id),
        cards: select_cards_as_map(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        push: (url: string) => dispatch(push(url))
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(AdminCollectionCards);
