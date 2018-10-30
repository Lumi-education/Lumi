import * as React from 'react';
import * as debug from 'debug';

import {
    Avatar,
    Card,
    CardHeader,
    CardText,
    CardActions,
    Paper,
    RaisedButton
} from 'material-ui';
import { ICard } from '..';

import * as Tags from 'lib/tags';
import * as Core from 'lib/core';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    card: ICard;
    edit: (event) => void;
    selected?: boolean;
    onClick?: () => void;
}

export default class CardComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const card = this.props.card;
        return (
            <Paper
                style={{ margin: '10px' }}
                onClick={this.props.onClick}
                zDepth={this.props.selected ? 5 : 1}
            >
                <Card
                    style={{
                        width: '200px',
                        height: '300px',
                        overflow: 'hidden',
                        background: this.props.selected ? 'lightgrey' : 'white'
                    }}
                >
                    <CardHeader
                        title={<div onClick={this.props.edit}>{card.name}</div>}
                        subtitle={<Tags.TagsContainer tag_ids={card.tags} />}
                        style={{ paddingBottom: '2px' }}
                        avatar={
                            <Avatar>
                                {card.card_type
                                    ? card.card_type
                                          .substring(0, 3)
                                          .toLocaleUpperCase()
                                    : 'X'}
                            </Avatar>
                        }
                    />
                    <CardText style={{ paddingTop: '2px' }}>
                        <Core.components.Markdown
                            ref_id={this.props.card._id}
                            markdown={this.props.card.text}
                        />
                    </CardText>
                    <CardActions>
                        <RaisedButton
                            onClick={this.props.edit}
                            label={Core.i18n.t('edit')}
                        />
                    </CardActions>
                </Card>
            </Paper>
        );
    }
}
