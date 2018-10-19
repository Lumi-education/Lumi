import * as React from 'react';
import * as debug from 'debug';

import { Paper } from 'material-ui';

import * as Core from 'lib/core';

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
        return (
            <Paper style={{ padding: '5px', margin: '5px' }}>
                <Core.components.Markdown
                    ref_id={this.props.card_id}
                    markdown={this.props.text}
                />
            </Paper>
        );
    }
}
