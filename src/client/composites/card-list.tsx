import * as React from 'react';

// components
import { Avatar, Divider, List, ListItem, IconButton } from 'material-ui';

// container
import TagsContainer from 'lib/tags/container/tags';

// types
import { ICard } from 'lib/cards';

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
                {this.props.cards.length === 0 ? (
                    <ListItem key="nocards" primaryText="No cards" />
                ) : null}
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
                            secondaryTextLines={2}
                            onClick={() => this.props.onClick(card._id)}
                        />
                        <Divider inset={true} />
                    </div>
                ))}
            </List>
        );
    }
}
