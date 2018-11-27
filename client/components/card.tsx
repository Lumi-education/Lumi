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

import CardsPreviewComponent from 'lib/cards/components/card-preview';
import { H5PIconAvatar } from 'client/components';

import * as Tags from 'lib/tags';
import * as Core from 'lib/core';
import * as Cards from 'lib/cards';
import { Divider } from 'material-ui';

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
        padding: 0
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
                            (card as any).h5p ? (
                                <H5PIconAvatar
                                    h5p_main_library={
                                        (card as any).h5p.mainLibrary
                                    }
                                />
                            ) : (
                                <Avatar>T</Avatar>
                            )
                        }
                        title={card.name}
                        subheader={<Tags.TagsContainer tag_ids={card.tags} />}
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <CardsPreviewComponent card={card} />
                    </CardContent>
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
