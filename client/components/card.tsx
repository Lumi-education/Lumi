import * as React from 'react';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import * as classnames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import * as Tags from 'lib/tags';
import * as Core from 'lib/core';
import * as Cards from 'lib/cards';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    card: Cards.ICard;
    select: () => void;
    view: () => void;

    selected: boolean;

    classes: any;
}

interface IComponentState {}

const styles: StyleRulesCallback = theme => ({
    card: {
        margin: '10px',
        minWidth: 250,
        maxWidth: 345,
        overflow: 'hidden',
        flex: 1
    },
    media: {
        height: 0,
        paddingTop: '56.25%' // 16:9
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
    avatar: {
        backgroundColor: red[500]
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
                <Card className={classes.card} raised={this.props.selected}>
                    <CardHeader
                        avatar={
                            <Cards.components.CardType
                                card_type={card.card_type}
                            />
                        }
                        action={
                            <IconButton onClick={this.props.select}>
                                {this.props.selected ? (
                                    <CheckBoxIcon />
                                ) : (
                                    <CheckBoxOutlineIcon />
                                )}
                            </IconButton>
                        }
                        title={card.name}
                        subheader={card.description}
                    />
                    <CardContent>
                        <Tags.TagsContainer tag_ids={card.tags} />
                    </CardContent>
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
