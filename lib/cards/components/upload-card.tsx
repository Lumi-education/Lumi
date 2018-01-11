import * as React from 'react';
import * as debug from 'debug';

import { Paper } from 'material-ui';
import Attachment from './attachment';

import * as markdownit from 'markdown-it';
const md = markdownit();

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    text: string;
    doc_id: string;
    _rev: string;
    attachments;
    insert_cb: (link: string) => void;
}

export default class UploadCardComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Paper style={{ padding: '5px', margin: '5px' }}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: md.render(this.props.text || '# No markdown')
                    }}
                />
                <Attachment {...this.props} />
            </Paper>
        );
    }
}
