// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import { Map } from 'immutable';

import {
    arrayMove,
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';

// components
import { Paper, Dialog } from 'material-ui';

// local
import { IState } from '../../../src/client/state';

// types
import { ICard } from 'lib/cards/types';
import { ICollection } from '../types';

// selectors
import { select_cards_as_map } from 'lib/cards/selectors';
import { select_collection_by_id } from 'lib/collections/selectors';

// actions
import { get_collection, update_collection } from 'lib/collections/actions';

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

        this.onSortEnd = this.onSortEnd.bind(this);
    }

    public onSortEnd({ oldIndex, newIndex }) {
        const items = arrayMove(this.props.cards, oldIndex, newIndex);
        this.props.dispatch(
            update_collection(this.props.collection_id, {
                cards: items.map(card => card._id)
            })
        );
    }

    public render() {
        return (
            <LIST
                axis="x"
                items={this.props.cards}
                onSortEnd={this.onSortEnd}
                {...this.props}
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

const ITEM = SortableElement(({ item }) => {
    return (
        <div style={{ margin: '20px' }}>
            <Paper style={{ height: '480px', width: '320px' }}>ITEM</Paper>
        </div>
    );
});

const LIST = SortableContainer(({ items }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            {items.map((card, index) => (
                <ITEM
                    key={`item-${index}`}
                    index={index}
                    item={{ card, index }}
                />
            ))}
        </div>
    );
});
