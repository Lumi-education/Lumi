import * as React from 'react';
import * as debug from 'debug';

import { Paper } from 'material-ui';
const log = debug('lumi:packages:cards:components:videocard');

interface IProps {
    video_url: string;
    youtube: boolean;
}

export default class VideoCardComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Paper style={{ padding: '5px', margin: '5px' }}>
                {this.props.youtube ? (
                    <iframe
                        width="100%"
                        src={this.props.video_url}
                        frameBorder="0"
                        allowFullScreen={true}
                    />
                ) : (
                    <video width="100%" controls={true}>
                        <source src={this.props.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </Paper>
        );
    }
}
