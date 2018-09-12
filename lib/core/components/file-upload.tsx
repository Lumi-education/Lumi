// modules
import * as React from 'react';
import * as debug from 'debug';

import Dropzone from 'react-dropzone';
import { LinearProgress } from 'material-ui';

import * as request from 'superagent';

import raven from 'lib/core/raven';

declare var window;

const log = debug('lumi:core:components:file-upload');

interface IPassedProps {
    post_url: string;
    path?: string;
    onSuccess?: (file) => void;
    onError?: (error) => void;
}

interface IDispatchProps {}

interface IComponentState {
    upload?: string;
}

interface IProps extends IPassedProps, IDispatchProps {}

export default class FileUploadComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.onDrop = this.onDrop.bind(this);

        this.state = {
            upload: 'init'
        };
    }

    public onDrop(acceptedFiles) {
        acceptedFiles.forEach(file => {
            const data = new FormData();

            data.append('file', file);
            data.append('filename', file.name);

            this.setState({ upload: 'pending' });

            const req = request
                .post(this.props.post_url + '?path=' + this.props.path)
                .send(data)
                .set(
                    'x-auth',
                    window.localStorage.jwt_token || window.jwt_token || ''
                )
                .then(() => {
                    if (this.props.onSuccess) {
                        this.props.onSuccess({
                            name: file.name,
                            path: this.props.path + '/' + file.name
                        });
                    }
                    this.setState({ upload: 'success' });
                    log('files attached', acceptedFiles);
                })
                .catch(err => {
                    this.setState({ upload: 'error' });
                    raven.captureException(err);
                    if (this.props.onError) {
                        this.props.onError(err);
                    }
                });
        });
    }

    public render() {
        return (
            <Dropzone style={{ width: '100%' }} onDrop={this.onDrop}>
                {this.state.upload === 'pending' ? (
                    <LinearProgress mode="indeterminate" color={'#f39c12'} />
                ) : (
                    this.props.children
                )}
            </Dropzone>
        );
    }
}
