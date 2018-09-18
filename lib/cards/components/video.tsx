import * as React from 'react';
import * as debug from 'debug';

import { Paper } from 'material-ui';
const log = debug('lumi:packages:cards:components:videocard');

import { convert_files_url } from '../utils';

interface IProps {
    video_url: string;
    card_id: string;
}

export default class VideoCardComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Paper style={{ padding: '5px', margin: '5px' }}>
                <video width="100%" controls={true}>
                    <source
                        src={convert_files_url(
                            this.props.video_url,
                            this.props.card_id
                        )}
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            </Paper>
        );
    }
}
