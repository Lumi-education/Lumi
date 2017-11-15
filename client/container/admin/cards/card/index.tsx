// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ChipInput from 'material-ui-chip-input';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import TagInput from 'client/components/tag-input';

import MultiplechoiceCard from 'client/components/cards/multiplechoice';

// local
import { IState } from 'client/state';

// components

// types
import { ICard, ITag } from 'lib/types';

// selectors
import { select_card } from 'client/state/cards/selectors';

import { select_tags_as_map } from 'client/state/tags/selectors';

// actions
import { snackbar_open } from 'client/state/ui/actions';
import {
    create_tag_and_add_to_card,
    get_tags
} from 'client/state/tags/actions';

import {
    get_card,
    add_tag_to_card,
    rem_tag_from_card,
    update_card,
    delete_card
} from 'client/state/cards/actions';

interface IStateProps {
    card: ICard;
    card_id: string;
    tags: Map<string, ITag>;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    text?: string;
    items?: string[];
    description?: string;
    name?: string;
    card_type?: 'multiplechoice' | 'freetext' | 'sort' | 'text' | 'video';
}

export class AdminCard extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            text: '',
            items: [],
            description: '',
            name: '',
            card_type: 'text'
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_card(this.props.card_id));
        this.props.dispatch(get_tags());
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
                                        this.setState({ name: v })}
                                />
                            </div>
                            <div style={{ flex: 4 }}>
                                <SelectField
                                    floatingLabelText="Card Type"
                                    value={this.state.card_type}
                                    onChange={(e, i, v) =>
                                        this.setState({ card_type: v })}
                                >
                                    <MenuItem
                                        value="text"
                                        primaryText="Markdown"
                                    />
                                    <MenuItem
                                        value="multiplechoice"
                                        primaryText="Multiplechoice"
                                    />
                                    <MenuItem
                                        value="freetext"
                                        primaryText="Freetext"
                                    />
                                    <MenuItem
                                        value="video"
                                        primaryText="Video"
                                    />
                                    <MenuItem value="sort" primaryText="Sort" />
                                </SelectField>
                            </div>
                        </div>
                        <TextField
                            hintText="Description"
                            floatingLabelText="Description"
                            value={this.state.description}
                            fullWidth={true}
                            onChange={(e, v) =>
                                this.setState({ description: v })}
                        />
                        <TagInput
                            tags={this.props.tags}
                            tag_ids={this.props.card.tags}
                            add={tag => {
                                this.props.tags.get(tag._id)
                                    ? this.props.dispatch(
                                          add_tag_to_card(
                                              this.props.card._id,
                                              tag._id
                                          )
                                      )
                                    : this.props.dispatch(
                                          create_tag_and_add_to_card(
                                              this.props.card._id,
                                              tag.name
                                          )
                                      );
                            }}
                            delete={(tag_id: string) =>
                                this.props.dispatch(
                                    rem_tag_from_card(
                                        this.props.card._id,
                                        tag_id
                                    )
                                )}
                        />
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 6 }}>
                                <TextField
                                    hintText="Text"
                                    floatingLabelText="Text"
                                    value={this.state.text}
                                    fullWidth={true}
                                    multiLine={true}
                                    onChange={(e, v) =>
                                        this.setState({ text: v })}
                                />
                                <TextField
                                    hintText="Items"
                                    floatingLabelText="Items"
                                    value={this.state.items.join('\n')}
                                    fullWidth={true}
                                    multiLine={true}
                                    onChange={(e, v) =>
                                        this.setState({ items: v.split('\n') })}
                                />
                                <TextField
                                    hintText="Hints"
                                    floatingLabelText="Hints"
                                    value=""
                                    fullWidth={true}
                                />
                            </div>
                            <div
                                style={{
                                    flex: 6,
                                    background:
                                        'linear-gradient(120deg, #8e44ad, #3498db)'
                                }}
                            >
                                <MultiplechoiceCard
                                    text={this.state.text}
                                    items={this.state.items}
                                />
                            </div>
                        </div>
                        <RaisedButton
                            label="Cancel"
                            style={{ margin: '10px' }}
                            onClick={() =>
                                this.props.dispatch(push('/admin/cards'))}
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
                                this.props.dispatch(
                                    update_card(this.props.card._id, this.state)
                                );
                                this.props.dispatch(push('/admin/cards'));
                            }}
                        />
                    </Paper>
                </div>
            );
        } else {
            return <div>loading</div>;
        }
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        tags: select_tags_as_map(state),
        card: select_card(state, ownProps.params.card_id),
        card_id: ownProps.params.card_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminCard
);
