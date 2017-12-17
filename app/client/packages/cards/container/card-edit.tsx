// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import { Map } from 'immutable';
import * as debug from 'debug';

// components
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { TagInputContainer } from 'client/packages/tags';
import MultiplechoiceCard from 'client/packages/cards/components/multiplechoice';
import CardViewContainer from './card-view';
import { List, ListItem } from 'material-ui/List';
import Dropzone from 'react-dropzone';

import * as request from 'superagent';
// types
import { IState } from 'client/state';
import { ICard } from 'common/types';

// selectors
import { select_card } from 'client/packages/cards/selectors';

import { select_tags_as_map } from 'client/packages/tags/selectors';

// actions

import {
    get_card,
    update_card,
    delete_card
} from 'client/packages/cards/actions';

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
    text?: string;
    items?: string[];
    description?: string;
    name?: string;
    card_type?: 'multiplechoice' | 'freetext' | 'sort' | 'text' | 'video';
}

export class CardEditContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            text: '',
            items: [],
            description: '',
            name: '',
            card_type: 'text'
        };

        this.insertAttachment = this.insertAttachment.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(get_card(this.props.card_id));
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            text: nextProps.card.text,
            items: nextProps.card.items,
            description: nextProps.card.description,
            name: nextProps.card.name,
            card_type: nextProps.card.card_type
        });
    }

    public insertAttachment(attachment: string) {
        this.setState({
            text:
                this.state.text +
                '![attachment](/api/v0/cards/' +
                this.props.card_id +
                '/attachment/' +
                attachment +
                ')'
        });
    }

    public onDrop(acceptedFiles) {
        log(acceptedFiles);
        acceptedFiles.forEach(file => {
            const req = request
                .put(
                    '/api/v0/' +
                        window.location.pathname.split('/')[1] +
                        '/cards/' +
                        this.props.card_id +
                        '/attachment/' +
                        file.name +
                        '?rev=' +
                        (this.props.card as any)._rev
                )
                .set('Content-Type', file.type)
                .send(file)
                .end(() => {
                    log('files attached', acceptedFiles);
                });
        });
    }

    public render() {
        if (this.props.card) {
            return (
                <div>
                    <Paper>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 8 }}>
                                <TextField
                                    hintText="Name"
                                    floatingLabelText="Name"
                                    value={this.state.name}
                                    fullWidth={true}
                                    onChange={(e, v) =>
                                        this.setState({ name: v })
                                    }
                                />
                            </div>
                            <div style={{ flex: 4 }}>
                                <SelectField
                                    floatingLabelText="Card Type"
                                    value={
                                        this.state.card_type || 'multiplechoice'
                                    }
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
                                </SelectField>
                            </div>
                        </div>
                        <TextField
                            hintText="Description"
                            floatingLabelText="Description"
                            value={this.state.description}
                            fullWidth={true}
                            onChange={(e, v) =>
                                this.setState({ description: v })
                            }
                        />
                        <TagInputContainer doc_id={this.props.card_id} />
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 6 }}>
                                <TextField
                                    hintText="Text"
                                    floatingLabelText="Text"
                                    value={this.state.text}
                                    fullWidth={true}
                                    multiLine={true}
                                    onChange={(e, v) =>
                                        this.setState({ text: v })
                                    }
                                />
                                <TextField
                                    hintText="Items"
                                    floatingLabelText="Items"
                                    value={this.state.items.join('\n')}
                                    fullWidth={true}
                                    multiLine={true}
                                    onChange={(e, v) =>
                                        this.setState({ items: v.split('\n') })
                                    }
                                />
                                <TextField
                                    hintText="Hints"
                                    floatingLabelText="Hints"
                                    value=""
                                    fullWidth={true}
                                />
                                <Dropzone onDrop={this.onDrop}>
                                    <List>
                                        {(() => {
                                            return Object.keys(
                                                this.props.card._attachments ||
                                                    {}
                                            ).map(key => (
                                                <ListItem
                                                    onClick={() =>
                                                        this.insertAttachment(
                                                            key
                                                        )
                                                    }
                                                    primaryText={key}
                                                />
                                            ));
                                        })()}
                                    </List>
                                </Dropzone>
                            </div>
                            <div
                                style={{
                                    width: '375px',
                                    height: '667px',
                                    background:
                                        'linear-gradient(120deg, #8e44ad, #3498db)'
                                }}
                            >
                                <CardViewContainer
                                    card_id={this.props.card_id}
                                    collection_id={null}
                                />
                            </div>
                        </div>
                        <RaisedButton
                            label="Cancel"
                            style={{ margin: '10px' }}
                            onClick={() =>
                                this.props.dispatch(push('/admin/cards'))
                            }
                        />
                        <RaisedButton
                            label="Delete"
                            style={{ margin: '10px' }}
                            onClick={() => {
                                this.props.dispatch(
                                    delete_card(this.props.card._id)
                                );
                                this.props.dispatch(push('/admin/cards'));
                            }}
                        />
                        <RaisedButton
                            label="Duplicate"
                            secondary={true}
                            style={{ margin: '10px' }}
                        />
                        <RaisedButton
                            label="Save"
                            primary={true}
                            style={{ margin: '10px' }}
                            onClick={() => {
                                this.props
                                    .dispatch(
                                        update_card(
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
                    </Paper>
                </div>
            );
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card: select_card(state, ownProps.card_id),
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
