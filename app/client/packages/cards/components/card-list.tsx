import * as React from 'react';

// components
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

// types
import { ICard } from 'common/types';

interface IStateProps {
    cards: ICard[];
}

interface IDispatchProps {
    onClick: (id: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}
interface IState {}

export default class CardListComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <List>
                {this.props.cards.map(card => (
                    <div>
                        <ListItem
                            leftAvatar={
                                <Avatar>{card.name.substring(0, 3)}</Avatar>
                            }
                            primaryText={card.name}
                            secondaryText={card.description}
                            onClick={() => this.props.onClick(card._id)}
                        />
                        <Divider inset={true} />
                    </div>
                ))}
            </List>
        );
    }
}
