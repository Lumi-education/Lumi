// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import * as markdownit from 'markdown-it';
import * as debug from 'debug';
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

import CardsRightDrawer from './right-drawer';

// local
import { IState } from 'client/state';

// types
import { ICard } from 'common/types';

// selectors
import {
    select_all_cards,
    select_cards_by_ids
} from 'client/packages/cards/selectors';
import {
    select_tags_as_map,
    select_doc_ids_for_tags
} from 'client/packages/tags/selectors';

// actions
import { get_cards, create_card } from 'client/packages/cards/actions';
import { get_tags } from 'client/packages/tags/actions';

const md = markdownit();
const log = debug('lumi:modules:admin:cards:cards-page');

interface IStateProps {
    cards: ICard[];
}

interface IDispatchProps {
    dispatch: (action) => any;
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
                <CardsRightDrawer />
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
                    selected_card_ids={[]}
                    onClick={(id: string) =>
                        this.props.dispatch(push('/admin/cards/' + id))
                    }
                />

                <FloatingActionButton
                    onClick={() => {
                        this.props.dispatch(create_card()).then(res => {
                            log('create_card promise resolved');
                            this.props.dispatch(
                                push('/admin/cards/' + res.payload._id)
                            );
                        });
                    }}
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
        cards:
            state.ui.tags_filter.length !== 0
                ? select_cards_by_ids(
                      state,
                      select_doc_ids_for_tags(state, state.ui.tags_filter)
                  )
                : select_all_cards(state)
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
