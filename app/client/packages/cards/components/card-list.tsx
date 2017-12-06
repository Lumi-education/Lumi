import * as React from 'react';

// components
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import { CompetenceContainer } from 'lumi/competences';
// types
import { ICard } from 'common/types';

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
                                    {card.name.substring(0, 3)}
                                </Avatar>
                            }
                            primaryText={card.name}
                            secondaryText={
                                <CompetenceContainer doc_id={card._id} />
                            }
                            onClick={() => this.props.onClick(card._id)}
                        />
                        <Divider inset={true} />
                    </div>
                ))}
            </List>
        );
    }
}
