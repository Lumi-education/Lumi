// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Map } from 'immutable';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SVGContentCreate from 'material-ui/svg-icons/content/create';
import {
    grey400,
    darkBlack,
    lightBlack,
    pinkA200,
    transparent
} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import FilterBar from 'client/components/filter-bar';

// local
import { IState } from 'client/state';

// types
import { ITag } from 'common/types';

// selectors
import { select_all_tags } from 'client/packages/tags/selectors';

// actions
import { get_tags, create_tag, delete_tag } from 'client/packages/tags/actions';

interface IStateProps {
    tags: ITag[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    filter?: string[];
    search_text?: string;
    new_tag_name?: string;
    new_tag_description?: string;
}

export class AdminTags extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            filter: [],
            search_text: '',
            new_tag_name: '',
            new_tag_description: ''
        };

        this.create_tag = this.create_tag.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(get_tags());
    }

    public create_tag() {
        if (this.state.new_tag_name !== '') {
            this.props.dispatch(
                create_tag(
                    this.state.new_tag_name,
                    this.state.new_tag_description
                )
            );
            this.setState({ new_tag_name: '', new_tag_description: '' });
        }
    }

    public render() {
        return (
            <div>
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })}
                />
                <Paper>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <TextField
                            style={{ flex: 4 }}
                            hintText="Tag"
                            value={this.state.new_tag_name}
                            onChange={(e, v) =>
                                this.setState({ new_tag_name: v })}
                        />
                        <TextField
                            style={{ flex: 7 }}
                            hintText="Description"
                            value={this.state.new_tag_description}
                            onChange={(e, v) =>
                                this.setState({ new_tag_description: v })}
                        />
                        <RaisedButton
                            style={{ flex: 1 }}
                            label="Add"
                            onClick={this.create_tag}
                        />
                    </div>
                </Paper>
                <Paper>
                    <List>
                        {this.props.tags
                            .filter(tag => {
                                return this.state.search_text === ''
                                    ? true
                                    : (tag.name + tag.description)
                                          .toLocaleLowerCase()
                                          .indexOf(
                                              this.state.search_text.toLocaleLowerCase()
                                          ) > -1;
                            })
                            .map(tag => (
                                <div>
                                    <ListItem
                                        leftAvatar={
                                            <Avatar
                                                style={{
                                                    background:
                                                        tag.color ||
                                                        'linear-gradient(120deg, #8e44ad, #3498db)'
                                                }} // || '#BCBCBC'}
                                            >
                                                {tag.short_name ||
                                                    tag.name.substring(0, 3)}
                                            </Avatar>
                                        }
                                        primaryText={tag.name}
                                        secondaryText={
                                            tag.description ||
                                            'this tag has no description'
                                        }
                                        rightIconButton={rightIconMenu([
                                            <MenuItem
                                                onClick={() =>
                                                    this.props.dispatch(
                                                        delete_tag(tag._id)
                                                    )}
                                            >
                                                Delete
                                            </MenuItem>
                                        ])}
                                    />
                                    <Divider inset={true} />
                                </div>
                            ))}
                    </List>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        tags: select_all_tags(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminTags
);

const iconButtonElement = (
    <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
        <MoreVertIcon color={grey400} />
    </IconButton>
);

function rightIconMenu(menuItems) {
    return (
        <IconMenu iconButtonElement={iconButtonElement}>{menuItems}</IconMenu>
    );
}
