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
import MaterialAssignDialog from './MaterialAssignDialog';

import LinearProgress from '@material-ui/core/LinearProgress';

import RightDrawer from './right-drawer';
import AppBar from './app-bar';

// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Material from 'lib/material';
import * as Flow from 'lib/flow';

import styles from './styles';
import moment = require('moment');

const ITEMS_PER_PAGE = 9;

const log_info = debug('lumi:info:pages:admin:material:material-page');

interface IStateProps {
    material: Material.models.Material[];
    selected_material: Material.models.Material[];
    selected_material_ids: string[];

    search_text: string;
    // selected_tags: string[];

    bookmark: string;
    page_has_more: boolean;
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
    page: number;
}

const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export class AdminCards extends React.Component<IProps, IComponentState> {
    private search_timeout: any;
    private load_more: any;
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
            loading_step: 0,
            open: false,
            loading_more: false,
            page: 0
        };

        this.set_search_text = this.set_search_text.bind(this);
        this.load_more = throttle((page: number) => {
            this.setState({ page });
            this.fetch_search();
        }, 500);

        this.fetch_search = this.fetch_search.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    public componentWillMount() {
        log_info('componentWillMount');
        this.fetch_search();
    }

    public fetch_search() {
        this.setState({ loading_more: true });
        const regex = this.props.search_text.split(' ').map(word => {
            return { index: { $regex: word.toLowerCase() } };
        });

        this.props
            .dispatch(
                Material.actions.find({
                    selector: {
                        $and: regex
                    },
                    limit: ITEMS_PER_PAGE,
                    skip:
                        this.props.bookmark !== 'nil' && this.props.bookmark
                            ? undefined
                            : this.state.page * ITEMS_PER_PAGE,
                    bookmark:
                        this.props.bookmark !== 'nil' && this.props.bookmark
                            ? this.props.bookmark
                            : undefined
                })
            )
            .then(res => {
                this.setState({ loading_more: false });
            });
    }

    public set_search_text(e) {
        this.props.dispatch(UI.actions.set_search_filter(e));
        clearTimeout(this.search_timeout);
        this.search_timeout = setTimeout(this.fetch_search, 1000);
        this.props.dispatch(Material.actions.ui_reset_bookmark());
        this.setState({ page: 0 });
    }

    public onDragEnd(result) {
        const { source, destination } = result;

        if (!destination) {
            return;
        }
        if (destination.droppableId === 'material_list') {
            return this.props.dispatch(
                Material.actions.remove_material_from_selection(
                    result.draggableId
                )
            );
        }
        if (
            destination.droppableId === 'material_selection' &&
            source.droppableId === 'material_selection'
        ) {
            const items = reorder(
                this.props.selected_material_ids,
                source.index,
                destination.index
            );

            return this.props.dispatch(
                Material.actions.set_selected_material(items)
            );
        }
        if (result.destination) {
            if (result.destination.droppableId === 'material_selection') {
                this.props.dispatch(
                    Material.actions.add_material_to_selection(
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

        const material = this.props.material
            // .sort(
            //     (a, b) =>
            //         moment(b.created_at).unix() - moment(a.created_at).unix()
            // )
            .filter(_material => {
                if (
                    this.props.selected_material_ids.indexOf(_material._id) > -1
                ) {
                    return false;
                }
                const search = this.props.search_text.toLowerCase().split(' ');
                const _index = _material.index;

                for (let i = 0; i < search.length; i++) {
                    if (_index.indexOf(search[i].toLowerCase()) === -1) {
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
                            pageStart={0}
                            loadMore={this.load_more}
                            hasMore={this.props.page_has_more}
                            threshold={20}
                            initialLoad={true}
                            loader={<div className="loader" key={0} />}
                        >
                            <Droppable droppableId="material_list">
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
                                        {material
                                            // .slice(
                                            //     0,
                                            //     this.state.page * ITEMS_PER_PAGE
                                            // )
                                            .map((_material, index) => (
                                                <Draggable
                                                    key={_material._id}
                                                    draggableId={_material._id}
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
                                                            <Material.components.MaterialCard
                                                                key={
                                                                    _material._id
                                                                }
                                                                material={
                                                                    _material
                                                                }
                                                                view={() =>
                                                                    this.props.dispatch(
                                                                        UI.actions.push(
                                                                            '/admin/material/' +
                                                                                _material._id
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

                    <RightDrawer
                        open={this.state.open}
                        close={() => this.setState({ open: false })}
                        material={this.props.selected_material}
                        view_material={(material_id: string) =>
                            this.props.dispatch(
                                UI.actions.push(
                                    '/admin/material/' + material_id
                                )
                            )
                        }
                        open_assign_dialog={() =>
                            this.props.dispatch(
                                Flow.actions.ui_open_user_assign_dialog()
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
                            .dispatch(Material.actions.create())
                            .then(_material => {
                                this.props.dispatch(
                                    UI.actions.push(
                                        '/admin/material/' + _material[0]._id
                                    )
                                );
                            });
                    }}
                >
                    <AddIcon />
                </Fab>
                {/* <CardsAssignDialog /> */}
                <MaterialAssignDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        material: Material.selectors.all(state),
        selected_material: Material.selectors.selected_material(state),
        selected_material_ids: state.material.ui.selected_material,
        // selected_tags: state.tags.ui.selected_tags,
        // material: state.material.ui.material,
        search_text: state.ui.search_filter_text,
        classes: ownProps.classes,
        bookmark: state.material.ui.bookmark,
        page_has_more: state.material.ui.page_has_more
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
