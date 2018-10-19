// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import * as path from 'path';

// components
import { TextField, SelectField, MenuItem, Paper } from 'material-ui';

import CardPreview from '../components/card-preview';

// modules
import * as Cards from '../';
import * as Core from 'lib/core';

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
                                <MenuItem value="text" primaryText="Text" />
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
                                                ' ![' +
                                                path.basename(file) +
                                                '](./' +
                                                file.replace(/\s/g, '%20') +
                                                ')'
                                        })
                                    )
                                }
                            />
                            <Core.components.FileUpload
                                post_url="/api/v0/core/upload"
                                path={this.props.card._id || 'tmp'}
                                onSuccess={file => {
                                    this.props.dispatch(
                                        Cards.actions.change_card({
                                            files: [
                                                ...this.props.card.files,
                                                path.basename(file.path)
                                            ]
                                        })
                                    );
                                }}
                            >
                                Drop files here
                            </Core.components.FileUpload>
                        </Paper>
                    </div>
                    <div style={{ flex: 4, maxWidth: '350px' }}>
                        <CardPreview card={this.props.card} />
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
