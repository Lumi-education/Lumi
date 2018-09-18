import * as React from 'react';
import * as debug from 'debug';

import { Paper } from 'material-ui';
import * as Cards from '../';

import Markdown from './markdown';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    text: string;
    card_id: string;
}

export default class UploadCardComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const text = Cards.utils.convert_files_url(
            this.props.text,
            this.props.card_id
        );

        return (
            <Paper style={{ padding: '5px', margin: '5px' }}>
                <Markdown
                    card_id={this.props.card_id}
                    markdown={this.props.text}
                />
                {this.props.children}
            </Paper>
        );
    }
}
