import * as React from 'react';
import * as debug from 'debug';

import {
    Avatar,
    Paper,
    Card,
    CardActions,
    CardHeader,
    CardText
} from 'material-ui';
import { ICard } from '../';

import * as markdownit from 'markdown-it';
import { CardListContainer } from '../container/card-list';
import { TagsContainer } from 'lib/tags';
import { convert_attachment_url } from '../utils';

const md = markdownit();

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    card: ICard;
}

export default class CardComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const card = this.props.card;
        return (
            <Card
                style={{
                    width: '200px',
                    height: '300px',
                    margin: '10px',
                    overflow: 'hidden'
                }}
            >
                <CardHeader
                    title={card.name}
                    subtitle={<TagsContainer doc_id={card._id} />}
                    style={{ paddingBottom: '2px' }}
                />
                <CardText style={{ paddingTop: '2px' }}>
                    {' '}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: md.render(
                                convert_attachment_url(card.text, card._id) ||
                                    '# No markdown'
                            )
                        }}
                    />
                </CardText>
            </Card>
        );
    }
}