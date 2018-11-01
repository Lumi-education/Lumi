import * as React from 'react';

// components
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import CardListItem from './card-list-item';

// modules
import * as Core from 'lib/core';
import * as Cards from 'lib/cards';

interface IPassedProps {
    cards: Cards.ICard[];
}

interface IDispatchProps {
    onListItemClick: (user_id: string) => void;
}

interface IProps extends IPassedProps, IDispatchProps {}

interface IComponentState {}

export default class CardListComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (this.props.cards.length === 0) {
            return (
                <Typography variant="h5" component="h3">
                    {Core.i18n.t('list_empty')}
                </Typography>
            );
        }
        return (
            <List component="nav">
                {this.props.cards.map(card => (
                    <div>
                        <CardListItem
                            key={card._id}
                            card={card}
                            onClick={() => this.props.onListItemClick(card._id)}
                        />
                        <Divider />
                    </div>
                ))}
            </List>
        );
    }
}
