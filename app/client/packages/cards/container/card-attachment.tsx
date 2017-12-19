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
import CardPreviewContainer from './card-preview';
import { List, ListItem } from 'material-ui/List';
import Dropzone from 'react-dropzone';

import * as request from 'superagent';
// types
import { IState } from 'client/state';
import { ICard } from '../types';

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
            // items: nextProps.card.items,
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
                <Dropzone onDrop={this.onDrop}>
                    <List>
                        {(() => {
                            return Object.keys(
                                this.props.card._attachments || {}
                            ).map(key => (
                                <ListItem
                                    onClick={() => this.insertAttachment(key)}
                                    primaryText={key}
                                />
                            ));
                        })()}
                    </List>
                </Dropzone>
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
