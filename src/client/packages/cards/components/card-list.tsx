import * as React from 'react';

// components
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

// container
import TagsContainer from 'client/packages/tags/container/tags';
// types
import { ICard } from '../types';

interface IStateProps {
    cards: ICard[];
    selected_card_ids: string[];
}

interface IDispatchProps {
    onClick: (id: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class CardListComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <List>
                {this.props.cards.map(card => (
                    <div key={card._id}>
                        <ListItem
                            leftAvatar={
                                <Avatar
                                    style={{
                                        background:
                                            this.props.selected_card_ids.indexOf(
                                                card._id
                                            ) > -1
                                                ? 'linear-gradient(120deg, #8e44ad, #3498db)'
                                                : 'grey'
                                    }}
                                >
                                    {card.card_type
                                        ? card.card_type.charAt(0).toUpperCase()
                                        : 'X'}
                                </Avatar>
                            }
                            primaryText={card.name}
                            secondaryText={<TagsContainer doc_id={card._id} />}
                            onClick={() => this.props.onClick(card._id)}
                        />
                        <Divider inset={true} />
                    </div>
                ))}
            </List>
        );
    }
}
