// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import { push } from 'lib/ui/actions';
import * as debug from 'debug';

// components
import {
    TextField,
    SelectField,
    MenuItem,
    Paper,
    RaisedButton
} from 'material-ui';
import ActionBar from 'lib/ui/components/action-bar';

import MultiplechoiceEditComponent from './multiplechoice-edit';
import MultiplechoiceComponent from '../components/multiplechoice-component';
import TextComponent from '../components/text-card-component';
import FreetextComponent from '../components/freetext-component';
import VideoComponent from '../components/video-card';
import UploadComponent from '../components/upload-card';

// state
import { ICard, IState } from '../types';

// modules
import * as Cards from 'lib/cards';
import * as core from 'lib/core';

const log = debug('lumi:container:cards:card-edit');

interface IPassedProps {
    card_id: string;
}

interface IStateProps extends IPassedProps {
    card: ICard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    description?: string;
    name?: string;
    text?: string;
    items?: string[];
    answer?: string;

    card_type?;
}

export class CardEditContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            description: '',
            name: '',
            card_type: 'text',
            text: '',
            items: [],
            answer: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(Cards.actions.get_card(this.props.card_id));
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            description: nextProps.card.description,
            name: nextProps.card.name,
            card_type: nextProps.card.card_type,
            text: nextProps.card.text,
            items: (nextProps.card as any).items,
            answer: (nextProps.card as any).answer
        });
    }

    public render() {
        if (this.props.card) {
            return (
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 6 }}>
                        <Paper>
                            <TextField
                                hintText="Name"
                                floatingLabelText="Name"
                                value={this.state.name}
                                fullWidth={true}
                                onChange={(e, v) => this.setState({ name: v })}
                            />
                            <SelectField
                                fullWidth={true}
                                floatingLabelText="Type"
                                value={this.state.card_type || 'multiplechoice'}
                                onChange={(e, i, v) =>
                                    this.setState({ card_type: v })
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
                                <MenuItem value="text" primaryText="Text" />
                                <MenuItem value="video" primaryText="Video" />
                                <MenuItem value="upload" primaryText="Upload" />
                            </SelectField>
                            <TextField
                                hintText="Description"
                                floatingLabelText="Description"
                                value={this.state.description}
                                fullWidth={true}
                                onChange={(e, v) =>
                                    this.setState({ description: v })
                                }
                            />
                            {this.props.children}
                            <TextField
                                floatingLabelText="Text"
                                value={this.state.text}
                                onChange={(e, v) => this.setState({ text: v })}
                                fullWidth={true}
                                multiLine={true}
                                rows={3}
                            />
                            {(() => {
                                switch (this.state.card_type) {
                                    case 'freetext':
                                        return (
                                            <TextField
                                                floatingLabelText="Answer"
                                                value={this.state.answer}
                                                onChange={(e, v) =>
                                                    this.setState({ answer: v })
                                                }
                                                fullWidth={true}
                                                multiLine={true}
                                            />
                                        );
                                    case 'multiplechoice':
                                        return (
                                            <TextField
                                                floatingLabelText="Items"
                                                value={this.state.items.join(
                                                    '\n'
                                                )}
                                                onChange={(e, v) =>
                                                    this.setState({
                                                        items: v.split('\n')
                                                    })
                                                }
                                                fullWidth={true}
                                                multiLine={true}
                                            />
                                        );
                                }
                            })()}
                            <core.components.attachment
                                doc_id={this.props.card._id}
                                _rev={this.props.card._rev}
                                attachments={this.props.card._attachments}
                                insert_cb={link =>
                                    this.setState({
                                        text: this.state.text + link
                                    })
                                }
                            />
                        </Paper>
                        <ActionBar>
                            <RaisedButton
                                label="Cancel"
                                style={{ margin: '10px' }}
                                onClick={() =>
                                    this.props.dispatch(push('/admin/cards'))
                                }
                            />
                            <RaisedButton
                                label="Delete"
                                secondary={true}
                                style={{ margin: '10px' }}
                                onClick={() => {
                                    this.props
                                        .dispatch(
                                            Cards.actions.delete_card(
                                                this.props.card._id
                                            )
                                        )
                                        .then(res =>
                                            this.props.dispatch(
                                                push('/admin/cards')
                                            )
                                        );
                                }}
                            />
                            <RaisedButton
                                label="Save"
                                primary={true}
                                style={{ margin: '10px' }}
                                onClick={() => {
                                    this.props
                                        .dispatch(
                                            Cards.actions.update_card(
                                                this.props.card._id,
                                                this.state
                                            )
                                        )
                                        .then(() => {
                                            this.props.dispatch(
                                                push('/admin/cards')
                                            );
                                        });
                                }}
                            />
                        </ActionBar>
                    </div>
                    <div style={{ flex: 6, padding: '20px' }}>
                        {(() => {
                            switch (this.state.card_type) {
                                case 'multiplechoice':
                                    return (
                                        <MultiplechoiceComponent
                                            _id={this.props.card_id}
                                            text={this.state.text}
                                            items={this.state.items}
                                        />
                                    );
                                case 'text':
                                    return (
                                        <TextComponent text={this.state.text} />
                                    );
                                case 'freetext':
                                    return (
                                        <FreetextComponent
                                            text={this.state.text}
                                            answer={this.state.answer}
                                            error_text={null}
                                            error_style={{ color: 'green' }}
                                        />
                                    );
                                case 'video':
                                    return (
                                        <VideoComponent
                                            video_url={''}
                                            youtube={true}
                                        />
                                    );
                                case 'upload':
                                    return (
                                        <UploadComponent
                                            text={this.state.text}
                                            doc_id={null}
                                            _rev={null}
                                            attachments={{}}
                                            insert_cb={noop}
                                        />
                                    );
                            }
                        })()}
                    </div>
                </div>
            );
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card: Cards.selectors.select_card(state, ownProps.card_id),
        card_id: ownProps.card_id
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
