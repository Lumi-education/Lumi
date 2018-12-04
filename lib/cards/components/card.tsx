import * as React from 'react';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import CardsPreviewComponent from 'lib/cards/components/card-preview';
import CardAvatar from './card-avatar';

import * as Core from 'lib/core';
import * as Cards from 'lib/cards';
import { Divider } from 'material-ui';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    card: Cards.ICard;
    view: () => void;
    classes: any;
}

interface IComponentState {}

const styles: StyleRulesCallback = theme => ({
    card: {
        margin: '10px',
        minWidth: 300,
        maxWidth: 300,
        maxHeight: 400,
        overflow: 'hidden',
        flex: 1
    },
    actions: {
        display: 'flex'
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8
        }
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    content: {
        maxHeight: 200,
        overflow: 'scroll',
        margin: 0,
        padding: 0,
        minWidth: 300,
        minHeight: 200
    },
    media: {
        minWidth: 300,
        minHeight: 200
    }
});

export default withStyles(styles)(
    class CardComponent extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {};
        }

        public render() {
            const { card, classes } = this.props;
            return (
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            (card as any).h5p ? (
                                <CardAvatar
                                    h5p_main_library={
                                        (card as any).h5p.mainLibrary
                                    }
                                />
                            ) : (
                                <Avatar>T</Avatar>
                            )
                        }
                        title={card.name}
                    />
                    <Divider />
                    {card.card_type === 'h5p' ? (
                        <CardMedia
                            className={classes.media}
                            image={
                                '/api/v0/core/attachment/' +
                                card._id +
                                '/preview.png'
                            }
                            title={card.name}
                        />
                    ) : (
                        <CardContent className={classes.content}>
                            <CardsPreviewComponent card={card} />
                        </CardContent>
                    )}

                    <Divider />
                    <CardActions
                        className={classes.actions}
                        disableActionSpacing={true}
                    >
                        <Button onClick={this.props.view} size="small">
                            {Core.i18n.t('view')}
                        </Button>
                    </CardActions>
                </Card>
            );
        }
    }
);
