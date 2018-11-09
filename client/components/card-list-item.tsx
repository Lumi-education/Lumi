import * as React from 'react';

// components
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// modules
import * as Cards from 'lib/cards';

interface IPassedProps {
    card: Cards.ICard;
    onClick: () => void;
}

interface IDispatchProps {}

interface IProps extends IPassedProps, IDispatchProps {}

interface IComponentState {}

export default class CardListItemComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const { card } = this.props;
        return (
            <ListItem onClick={this.props.onClick}>
                <Avatar>{card.name.substring(0, 2)}</Avatar>
                <ListItemText primary={card.name} />
            </ListItem>
        );
    }
}
