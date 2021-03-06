import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from 'client/state';

import * as debug from 'debug';
import * as InfiniteScroll from 'react-infinite-scroller';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// components
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import MaterialCard from '../components/MaterialCard';

// modules
import * as Core from 'lib/core';
import * as Material from '../';

const log_info = debug('lumi:material:components:UserList');

const ITEMS_PER_PAGE = 6;

interface IPassedProps {
    material: Material.models.Material[];

    on_add_click?: () => void;
    on_remove_click?: () => void;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IStateProps {
    search_text: string;
    classes: any;
}

interface IProps extends IPassedProps, IDispatchProps, IStateProps {}

interface IComponentState {
    page: number;
}

const styles: StyleRulesCallback = theme => ({
    center: {
        margin: 'auto',
        justifyContent: 'center',
        display: 'flex'
    },
    listContent: {
        maxHeight: '70vh',
        overflow: 'auto'
    },
    message: {
        margin: theme.spacing.unit
    }
});

export class UserListComponent extends React.Component<
    IProps,
    IComponentState
> {
    private scrollParentRef;
    constructor(props: IProps) {
        super(props);

        this.state = {
            page: 1
        };

        this.load_more = this.load_more.bind(this);
        this.on_add_click = this.on_add_click.bind(this);
        this.on_remove_click = this.on_remove_click.bind(this);
    }

    public load_more(page: number) {
        log_info('load_more', page);
        this.setState({ page });
    }

    public on_add_click() {
        // this.props.on_add_click
        //     ? this.props.on_add_click()
        //     : this.props.dispatch(Users.actions.ui_show_dialog('create'));
    }

    public on_remove_click() {
        // this.props.on_remove_click
        //     ? this.props.on_remove_click()
        //     : this.props.dispatch(Users.actions.ui_show_dialog('delete'));
    }

    public render() {
        const { classes } = this.props;
        const material = this.props.material
            .filter(
                _material => _material.name.indexOf(this.props.search_text) > -1
            )
            .sort(Core.utils.alphabetically);

        return (
            <div>
                <Core.components.ListToolbar
                    on_add_click={this.on_add_click}
                    on_remove_click={this.on_remove_click}
                    title={Core.i18n.t('material')}
                />
                <div
                    className={classes.listContent}
                    ref={ref => (this.scrollParentRef = ref)}
                >
                    <InfiniteScroll
                        pageStart={1}
                        loadMore={this.load_more}
                        hasMore={
                            this.state.page * ITEMS_PER_PAGE < material.length
                        }
                        threshold={20}
                        loader={<div className="loader" key={0} />}
                        getScrollParent={() => this.scrollParentRef}
                        useWindow={false}
                    >
                        {material.length === 0 ? (
                            <div>
                                <Typography
                                    className={classes.message}
                                    component="h5"
                                    variant="h5"
                                    align="center"
                                >
                                    {Core.i18n.t('material.list_empty')}
                                </Typography>
                                <div className={classes.center}>
                                    <Button
                                        onClick={this.props.on_add_click}
                                        variant="contained"
                                        color="primary"
                                    >
                                        {Core.i18n.t('material.add')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <List component="nav" className={classes.list}>
                                {material
                                    .slice(0, this.state.page * ITEMS_PER_PAGE)
                                    .map(_material => (
                                        <div key={_material._id}>
                                            <MaterialCard
                                                material={_material}
                                                view={() => console.log('test')}
                                            />
                                            <Divider />
                                        </div>
                                    ))}
                            </List>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        search_text: state.ui.search_filter_text
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(UserListComponent)
);
