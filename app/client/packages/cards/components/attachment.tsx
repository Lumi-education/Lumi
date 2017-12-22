// modules
import * as React from 'react';
import * as debug from 'debug';

// components
import Paper from 'material-ui/Paper';

import { List, ListItem, RaisedButton } from 'material-ui';
import Dropzone from 'react-dropzone';

import * as request from 'superagent';
// types

// selectors
// actions

const log = debug('lumi:cards:components:card-attachment');

interface IPassedProps {
    doc_id: string;
    _rev: string;
    attachments;
}

interface IDispatchProps {
    insert_cb: (link: string) => void;
}

interface IProps extends IPassedProps, IDispatchProps {}

export default class CardAttachmentComponent extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);

        this.insertAttachment = this.insertAttachment.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    public insertAttachment(attachment: string) {
        this.props.insert_cb('![attachment](/attachment/' + attachment + ')');
    }

    public onDrop(acceptedFiles) {
        log(acceptedFiles);
        acceptedFiles.forEach(file => {
            const req = request
                .put(
                    '/api/v0/' +
                        window.location.pathname.split('/')[1] +
                        '/cards/' +
                        this.props.doc_id +
                        '/attachment/' +
                        file.name +
                        '?rev=' +
                        this.props._rev
                )
                .set('Content-Type', file.type)
                .send(file)
                .end(() => {
                    log('files attached', acceptedFiles);
                });
        });
    }

    public render() {
        return (
            <div>
                <List>
                    {(() => {
                        return Object.keys(this.props.attachments || {}).map(
                            key => (
                                <ListItem
                                    key={key}
                                    onClick={() => this.insertAttachment(key)}
                                    primaryText={key}
                                />
                            )
                        );
                    })()}
                </List>
                <Dropzone onDrop={this.onDrop}>
                    <RaisedButton primary={true} label="Add attachment" />
                </Dropzone>
            </div>
        );
    }
}
