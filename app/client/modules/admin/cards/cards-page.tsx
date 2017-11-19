// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as markdownit from 'markdown-it';

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
import {
    pinkA200,
    transparent,
    grey400,
    darkBlack,
    lightBlack
} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SVGContentCreate from 'material-ui/svg-icons/content/create';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Tag from 'client/packages/tags/components/tag';
import FilterBar from 'client/packages/ui/components/filter-bar';

import CardListComponent from 'client/packages/cards/components/card-list';

// local
import { IState } from 'client/state';

// types
import { ICard, ITag } from 'common/types';

// selectors
import { select_all_cards } from 'client/packages/cards/selectors';
import { select_tags_as_map } from 'client/packages/tags/selectors';

// actions
import { get_cards, create_card } from 'client/packages/cards/actions';
import { get_tags } from 'client/packages/tags/actions';

const md = markdownit();

interface IStateProps {
    cards: ICard[];
    tags: Map<string, ITag>;
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

export class AdminCards extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            filter: [],
            search_text: '',
            new_tag_name: '',
            new_tag_description: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_cards());
        this.props.dispatch(get_tags());
    }

    public render() {
        return (
            <div>
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })}
                />
                <CardListComponent
                    cards={this.props.cards.filter(card => {
                        return this.state.search_text === ''
                            ? true
                            : (card.name + card.description)
                                  .toLocaleLowerCase()
                                  .indexOf(
                                      this.state.search_text.toLocaleLowerCase()
                                  ) > -1;
                    })}
                    onClick={(id: string) =>
                        this.props.dispatch(push('/admin/cards/' + id))}
                />

                <FloatingActionButton
                    onClick={() => this.props.dispatch(create_card())}
                    style={{
                        margin: '20px',
                        bottom: '0px',
                        right: '20px',
                        position: 'fixed'
                    }}
                >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        cards: select_all_cards(state),
        tags: select_tags_as_map(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminCards
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
