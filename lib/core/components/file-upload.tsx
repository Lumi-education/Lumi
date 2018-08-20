// modules
import * as React from 'react';
import * as debug from 'debug';

import Dropzone from 'react-dropzone';

import * as request from 'superagent';

const log = debug('lumi:core:components:file-upload');

interface IPassedProps {
    post_url: string;
    path?: string;
    onSuccess?: (file) => void;
}

interface IDispatchProps {}

interface IComponentState {}

interface IProps extends IPassedProps, IDispatchProps {}

export default class FileUploadComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.onDrop = this.onDrop.bind(this);
    }

    public onDrop(acceptedFiles) {
        acceptedFiles.forEach(file => {
            const data = new FormData();

            data.append('file', file);
            data.append('filename', file.name);

            const req = request
                .post(this.props.post_url + '?path=' + this.props.path)
                .send(data)
                .end(() => {
                    if (this.props.onSuccess) {
                        this.props.onSuccess({
                            name: file.name,
                            path: this.props.path + '/' + file.name
                        });
                    }
                    log('files attached', acceptedFiles);
                });
        });
    }

    public render() {
        return <Dropzone onDrop={this.onDrop}>{this.props.children}</Dropzone>;
    }
}
