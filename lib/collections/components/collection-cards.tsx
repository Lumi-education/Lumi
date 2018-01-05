// modules
import * as React from 'react';

import {
    arrayMove,
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';

import { convert_attachment_url } from 'lib/cards/utils';

import MultiplechoiceComponent from 'lib/cards/components/multiplechoice-component';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SVGClose from 'material-ui/svg-icons/navigation/close';
// types
import { ICard } from 'lib/cards/types';

interface IStateProps {
    cards: ICard[];
}

interface IDispatchProps {
    update_cards_order: (new_order: string[]) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class CardList extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};

        this.onSortEnd = this.onSortEnd.bind(this);
    }

    public onSortEnd({ oldIndex, newIndex }) {
        const items = arrayMove(this.props.cards, oldIndex, newIndex);
        this.props.update_cards_order(items.map(card => card._id));
    }

    public render() {
        return (
            <div>
                <LIST
                    axis="x"
                    items={this.props.cards}
                    onSortEnd={this.onSortEnd}
                    {...this.props}
                />
            </div>
        );
    }
}

const ITEM = SortableElement(({ item }) => {
    return (
        <div style={{ margin: '20px' }}>
            <FloatingActionButton>{item.index + 1}</FloatingActionButton>
            <Paper style={{ height: '480px', width: '320px' }}>
                <MultiplechoiceComponent
                    text={convert_attachment_url(item.card.text, item.card._id)}
                    items={item.card.items.map(i =>
                        convert_attachment_url(i, item.card._id)
                    )}
                    show_correct_values={true}
                />
            </Paper>
            <FloatingActionButton mini={true} secondary={true}>
                <SVGClose />
            </FloatingActionButton>
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
