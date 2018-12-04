// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { throttle } from 'lodash';
import * as classNames from 'classnames';
import * as InfiniteScroll from 'react-infinite-scroller';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import LinearProgress from '@material-ui/core/LinearProgress';

import CardsPageRightDrawer from './right-drawer';
import AppBar from './app-bar';

// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';

import styles from './styles';
import moment = require('moment');
import CardsAssignDialog from 'client/dialogs/cards-assign-dialog';

const log = debug('lumi:modules:admin:cards:cards-page');

interface IStateProps {
    cards: Cards.ICard[];
    selected_cards: Cards.ICard[];
    selected_card_ids: string[];
    card: Cards.ICard;

    search_text: string;
    selected_tags: string[];

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading?: boolean;
    loading_step?: number;
    open?: boolean;
    loading_more: boolean;
    search_text?: string;
    page: number;
}

const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export class AdminCards extends React.Component<IProps, IComponentState> {
    private load_more: any;
    // private search_timeout: any;
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
            loading_step: 0,
            open: true,
            loading_more: false,
            search_text: '',
            page: 1
        };

        this.load_more = throttle((page: number) => {
            this.setState({ page });
            // this.setState({ loading_more: true });
            // this.props
            //     .dispatch(
            //         Core.actions.find(
            //             {
            //                 type: 'card',
            //                 tags: { $all: this.props.selected_tags },
            //                 created_at: { $gt: null }
            //             },
            //             {
            //                 limit: 3,
            //                 skip: page * 3 + 9,
            //                 sort: [{ created_at: 'desc' }]
            //             }
            //         )
            //     )
            //     .then(res => this.setState({ loading_more: false }));
        }, 1000);

        this.set_search_text = this.set_search_text.bind(this);
        // this.fetch_search = this.fetch_search.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    public componentWillMount() {
        this.setState({ loading: true });
        this.props.dispatch(Cards.actions.get_cards()).then(res => {
            this.setState({ loading: false });
        });
        // this.props
        //     .dispatch(
        //         Core.actions.find(
        //             {
        //                 type: 'card',
        //                 tags: { $all: this.props.selected_tags },
        //                 created_at: { $gt: null }
        //             },
        //             {
        //                 limit: 9,
        //                 sort: [{ created_at: 'desc' }]
        //             }
        //         )
        //     )
        //     .then(res => {
        //         this.setState({ loading: 'finished', loading_step: 2 });
        //     });
    }

    public set_search_text(e) {
        // clearTimeout(this.search_timeout);
        // this.search_timeout = setTimeout(this.fetch_search, 1000);
        this.props.dispatch(UI.actions.set_search_filter(e));
    }

    // public fetch_search() {
    //     const regex = this.props.search_text.split(' ').map(word => {
    //         return { name: { $regex: word } };
    //     });
    //     this.props.dispatch(
    //         Core.actions.find(
    //             {
    //                 type: 'card',
    //                 $and: regex,
    //                 created_at: { $gt: null }
    //             },
    //             {
    //                 limit: 9,
    //                 sort: [{ created_at: 'desc' }]
    //             }
    //         )
    //     );
    // }

    // public componentDidUpdate(prevProps: IProps, prevState: IComponentState) {
    //     if (this.props.selected_tags !== prevProps.selected_tags) {
    //         this.props.dispatch(
    //             Core.actions.find(
    //                 {
    //                     type: 'card',
    //                     tags: { $all: this.props.selected_tags },
    //                     created_at: { $gt: null }
    //                 },
    //                 {
    //                     limit: 9,
    //                     sort: [{ created_at: 'desc' }]
    //                 }
    //             )
    //         );
    //     }
    // }

    public onDragEnd(result) {
        const { source, destination } = result;

        if (!destination) {
            return;
        }
        if (destination.droppableId === 'cards_list') {
            return this.props.dispatch(
                Cards.actions.remove_card_from_selection(result.draggableId)
            );
        }
        if (
            destination.droppableId === 'cards_selection' &&
            source.droppableId === 'cards_selection'
        ) {
            const items = reorder(
                this.props.selected_card_ids,
                source.index,
                destination.index
            );

            return this.props.dispatch(Cards.actions.set_selected_cards(items));
        }
        if (result.destination) {
            if (result.destination.droppableId === 'cards_selection') {
                this.props.dispatch(
                    Cards.actions.add_card_to_selection(
                        result.draggableId,
                        destination.index
                    )
                );
            }
        }
    }

    public shouldComponentUpdate(
        nextProps: IProps,
        nextState: IComponentState
    ) {
        return !nextState.loading_more;
    }

    public render() {
        const { classes } = this.props;
        const { open } = this.state;

        const cards = this.props.cards
            .sort(
                (a, b) =>
                    moment(b.created_at).unix() - moment(a.created_at).unix()
            )
            .filter(card => {
                if (this.props.selected_card_ids.indexOf(card._id) > -1) {
                    return false;
                }
                const search = this.props.search_text.split(' ');

                for (let i = 0; i < search.length; i++) {
                    if (!card._index) {
                        return false;
                    }
                    if (card._index.indexOf(search[i].toLowerCase()) === -1) {
                        return false;
                    }
                }

                return true;
            });

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    show={() => this.setState({ open: true })}
                    menu_open={() =>
                        this.props.dispatch(UI.actions.left_drawer_open())
                    }
                    open={open}
                    set_search_text={this.set_search_text}
                />
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: open
                        })}
                    >
                        {this.state.loading ? <LinearProgress /> : null}

                        <InfiniteScroll
                            pageStart={1}
                            loadMore={this.load_more}
                            hasMore={this.state.page * 9 < cards.length}
                            threshold={20}
                            loader={<div className="loader" key={0} />}
                        >
                            <Droppable droppableId="cards_list">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            maxWidth: '1400px',
                                            margin: '30px'
                                        }}
                                    >
                                        {cards
                                            .slice(0, this.state.page * 9)
                                            .map((card, index) => (
                                                <Draggable
                                                    key={card._id}
                                                    draggableId={card._id}
                                                    index={index}
                                                >
                                                    {(_provided, _snapshot) => (
                                                        <div
                                                            ref={
                                                                _provided.innerRef
                                                            }
                                                            {..._provided.draggableProps}
                                                            {..._provided.dragHandleProps}
                                                            style={
                                                                _provided
                                                                    .draggableProps
                                                                    .style
                                                            }
                                                        >
                                                            <Cards.components.Card
                                                                key={card._id}
                                                                card={card}
                                                                view={() =>
                                                                    this.props.dispatch(
                                                                        UI.actions.push(
                                                                            '/admin/cards/' +
                                                                                card._id
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </InfiniteScroll>
                    </main>

                    <CardsPageRightDrawer
                        open={this.state.open}
                        close={() => this.setState({ open: false })}
                        open_assign_dialog={() =>
                            this.props.dispatch(
                                UI.actions.toggle_assign_material_dialog()
                            )
                        }
                        cards={this.props.selected_cards}
                        view_card={(card_id: string) =>
                            this.props.dispatch(
                                UI.actions.push('/admin/cards/' + card_id)
                            )
                        }
                    />
                </DragDropContext>
                <Fab
                    color="primary"
                    aria-label="Add"
                    className={classNames(classes.fab, {
                        [classes.rightDrawerOpen]: open
                    })}
                    onClick={() => {
                        this.props
                            .dispatch(Cards.actions.create_card())
                            .then(res => {
                                this.props.dispatch(
                                    UI.actions.push(
                                        '/admin/cards/' + res.payload._id
                                    )
                                );
                            });
                    }}
                >
                    <AddIcon />
                </Fab>
                <CardsAssignDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        cards: Cards.selectors.with_tags(state, state.tags.ui.selected_tags),
        selected_cards: Cards.selectors.selected_cards(state),
        selected_card_ids: state.cards.ui.selected_cards,
        selected_tags: state.tags.ui.selected_tags,
        card: state.cards.ui.card,
        search_text: state.ui.search_filter_text,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(AdminCards)
);
