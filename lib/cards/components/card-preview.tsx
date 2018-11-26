import * as React from 'react';
import * as debug from 'debug';

import { Paper } from 'material-ui';

import * as Cards from '../';
import * as UI from 'lib/ui';

import MultiplechoiceComponent from './multiplechoice';
import FreetextComponent from './freetext';
import TextComponent from './text';
import VideoComponent from './video';
import UploadComponent from './upload';
import H5PComponent from './h5p';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    card: Cards.ICard;
}

export default class CardPreviewComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const card = this.props.card;
        return (
            <div id="card_preview" className="device-container ">
                <div className="device-mockup iphone6_plus portrait black ">
                    <div className="device ">
                        <div className="screen ">
                            <div
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    overflow: 'scroll',

                                    background: UI.config.gradient_bg
                                }}
                            >
                                {(() => {
                                    switch (card.card_type) {
                                        case 'multiplechoice':
                                            return (
                                                <MultiplechoiceComponent
                                                    card_id={card._id || 'tmp'}
                                                    text={card.text || ''}
                                                    items={card.items || ['']}
                                                    selected_items={[]}
                                                    show_correct_values={true}
                                                />
                                            );
                                        case 'text':
                                            return (
                                                <TextComponent
                                                    card_id={card._id || 'tmp'}
                                                    text={card.text || ''}
                                                />
                                            );
                                        case 'freetext':
                                            return (
                                                <FreetextComponent
                                                    card_id={card._id || 'tmp'}
                                                    text={card.text || ''}
                                                    answer={card.answer || ''}
                                                />
                                            );
                                        case 'video':
                                            return (
                                                <VideoComponent
                                                    card_id={card._id || 'tmp'}
                                                    video_url={
                                                        card.video_url || ''
                                                    }
                                                />
                                            );
                                        case 'upload':
                                            return (
                                                <UploadComponent
                                                    card_id={card._id || 'tmp'}
                                                    text={card.text || ''}
                                                />
                                            );
                                        case 'h5p':
                                            return (
                                                <Paper>
                                                    <H5PComponent
                                                        key={card.content_id}
                                                        content_id={
                                                            card._id || ''
                                                        }
                                                        h5p_found={
                                                            card.content_id
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                </Paper>
                                            );
                                    }
                                })()}
                            </div>
                        </div>
                        <div className="button " />
                    </div>
                </div>
            </div>
        );
    }
}
