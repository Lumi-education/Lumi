// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import { push } from '../../ui/actions';
import * as debug from 'debug';
import Dropzone from 'react-dropzone';
import * as request from 'superagent';

// components
import {
    Checkbox,
    TextField,
    SelectField,
    MenuItem,
    Paper,
    RaisedButton
} from 'material-ui';
import ActionBar from '../../ui/components/action-bar';

import MultiplechoiceComponent from '../components/multiplechoice';
import TextComponent from '../components/text';
import FreetextComponent from '../components/freetext';
import VideoComponent from '../components/video';
import UploadComponent from '../components/upload';
import H5PComponent from '../components/h5p';
// modules
import * as Cards from '..';
import * as Core from '../../core';

const log = debug('lumi:container:cards:card-edit');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    card: Cards.ICard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class CardEditContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        // this.props.dispatch(Cards.actions.get_card(this.props.card_id));
    }

    public render() {
        const card = this.props.card;
        if (this.props.card) {
            return (
                <div
                    style={{
                        display: 'flex'
                    }}
                >
                    <div style={{ flex: 6 }}>
                        <Paper style={{ margin: '15px', padding: '20px' }}>
                            <TextField
                                hintText="Name"
                                floatingLabelText="Name"
                                value={card.name || ''}
                                fullWidth={true}
                                onChange={(e, v) =>
                                    this.props.dispatch(
                                        Cards.actions.change_card({ name: v })
                                    )
                                }
                            />
                            <SelectField
                                fullWidth={true}
                                floatingLabelText="Type"
                                value={
                                    card.card_type ||
                                    Core.config.default_card_type
                                }
                                onChange={(e, i, v) =>
                                    this.props.dispatch(
                                        Cards.actions.change_card({
                                            card_type: v
                                        })
                                    )
                                }
                            >
                                <MenuItem
                                    value="multiplechoice"
                                    primaryText="Multiplechoice"
                                />
                                <MenuItem
                                    value="freetext"
                                    primaryText="Freetext"
                                />
                                <MenuItem value="h5p" primaryText="H5P" />
                                {/*<MenuItem value="text" primaryText="Text" /> */}
                                <MenuItem value="video" primaryText="Video" />
                                <MenuItem value="upload" primaryText="Upload" />
                            </SelectField>
                            <TextField
                                hintText="Description"
                                floatingLabelText="Description"
                                value={card.description || ''}
                                fullWidth={true}
                                onChange={(e, v) =>
                                    this.props.dispatch(
                                        Cards.actions.change_card({
                                            description: v
                                        })
                                    )
                                }
                            />
                            {this.props.children}
                            <TextField
                                floatingLabelText="Text"
                                value={card.text || ''}
                                onChange={(e, v) =>
                                    this.props.dispatch(
                                        Cards.actions.change_card({ text: v })
                                    )
                                }
                                fullWidth={true}
                                multiLine={true}
                                rows={3}
                            />
                            {(() => {
                                switch (card.card_type) {
                                    case 'video':
                                        return (
                                            <div>
                                                {' '}
                                                <TextField
                                                    floatingLabelText="Video URL"
                                                    value={card.video_url || ''}
                                                    onChange={(e, v) =>
                                                        this.props.dispatch(
                                                            Cards.actions.change_card(
                                                                {
                                                                    video_url: v
                                                                }
                                                            )
                                                        )
                                                    }
                                                    fullWidth={true}
                                                    multiLine={true}
                                                />
                                            </div>
                                        );
                                    case 'h5p':
                                        return (
                                            <div>
                                                <TextField
                                                    floatingLabelText="Content ID"
                                                    value={
                                                        card.content_id || ''
                                                    }
                                                    onChange={(e, v) =>
                                                        this.props.dispatch(
                                                            Cards.actions.change_card(
                                                                {
                                                                    content_id: v
                                                                }
                                                            )
                                                        )
                                                    }
                                                    fullWidth={true}
                                                    multiLine={true}
                                                    errorText={
                                                        card.content_id
                                                            ? null
                                                            : 'Content ID benötigt'
                                                    }
                                                />
                                                <Core.components.FileUpload
                                                    post_url="/api/v0/h5p"
                                                    onSuccess={file => {
                                                        this.props.dispatch(
                                                            Cards.actions.change_card(
                                                                {
                                                                    content_id:
                                                                        file.name
                                                                }
                                                            )
                                                        );
                                                    }}
                                                >
                                                    Drop .h5p files here
                                                </Core.components.FileUpload>
                                                {/* <form
                                                    id="uploadForm"
                                                    action="/api/v0/h5p"
                                                    method="post"
                                                    target="_blank"
                                                    encType="multipart/form-data"
                                                >
                                                    <input
                                                        type="file"
                                                        name="uploaded_file"
                                                    />
                                                    <input
                                                        type="submit"
                                                        value="Upload!"
                                                    />
                                                </form> */}
                                            </div>
                                        );
                                    case 'freetext':
                                        return (
                                            <div>
                                                <TextField
                                                    floatingLabelText="Answer"
                                                    value={card.answer || ''}
                                                    onChange={(e, v) =>
                                                        this.props.dispatch(
                                                            Cards.actions.change_card(
                                                                {
                                                                    answer: v
                                                                }
                                                            )
                                                        )
                                                    }
                                                    fullWidth={true}
                                                    multiLine={true}
                                                />
                                                <Checkbox
                                                    checked={card.auto_grade}
                                                    label="Autograde"
                                                />
                                            </div>
                                        );
                                    case 'multiplechoice':
                                        return (
                                            <TextField
                                                floatingLabelText="Items"
                                                value={
                                                    card.items
                                                        ? card.items.join('\n')
                                                        : ''
                                                }
                                                onChange={(e, v) =>
                                                    this.props.dispatch(
                                                        Cards.actions.change_card(
                                                            {
                                                                items: v.split(
                                                                    '\n'
                                                                )
                                                            }
                                                        )
                                                    )
                                                }
                                                fullWidth={true}
                                                multiLine={true}
                                            />
                                        );
                                }
                            })()}
                            <Core.components.FileList
                                files={this.props.card.files || []}
                                onClick={file =>
                                    this.props.dispatch(
                                        Cards.actions.change_card({
                                            text:
                                                this.props.card.text +
                                                ' ![test](/files/' +
                                                file.replace(/\s/g, '%20') +
                                                ')'
                                        })
                                    )
                                }
                            />
                            <Core.components.FileUpload
                                post_url="/api/v0/core/upload"
                                path={this.props.card._id || 'no_id'}
                                onSuccess={file => {
                                    this.props.dispatch(
                                        Cards.actions.change_card({
                                            files: [file.path]
                                        })
                                    );
                                }}
                            >
                                Drop files here
                            </Core.components.FileUpload>
                        </Paper>
                    </div>
                    <div
                        style={{
                            flex: 6,
                            padding: '20px'
                        }}
                    >
                        {(() => {
                            switch (card.card_type) {
                                case 'multiplechoice':
                                    return (
                                        <MultiplechoiceComponent
                                            text={card.text || ''}
                                            items={card.items || ['']}
                                        />
                                    );
                                case 'text':
                                    return (
                                        <TextComponent text={card.text || ''} />
                                    );
                                case 'freetext':
                                    return (
                                        <FreetextComponent
                                            text={card.text || ''}
                                            answer={card.answer || ''}
                                        />
                                    );
                                case 'video':
                                    return (
                                        <VideoComponent
                                            video_url={card.video_url || ''}
                                        />
                                    );
                                case 'upload':
                                    return (
                                        <UploadComponent
                                            text={card.text || ''}
                                            doc_id={null}
                                            _rev={null}
                                            attachments={{}}
                                            insert_cb={noop}
                                        />
                                    );
                                case 'h5p':
                                    return (
                                        <Paper>
                                            <H5PComponent
                                                content_id={
                                                    card.content_id || ''
                                                }
                                            />
                                        </Paper>
                                    );
                            }
                        })()}
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    return {
        card: state.cards.ui.card
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(CardEditContainer);
