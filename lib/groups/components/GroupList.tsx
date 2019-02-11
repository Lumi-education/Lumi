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

import GroupListItem from './GroupListItem';
import GroupCreateDialog from './GroupCreateDialog';
import GroupDeleteDialog from './GroupDeleteDialog';

// modules
import * as Core from 'lib/core';
import * as Groups from '../';

const log_info = debug('lumi:users:components:UserList');

const ITEMS_PER_PAGE = 6;

interface IPassedProps {
    groups: Groups.models.Group[];

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

export class GroupListComponent extends React.Component<
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
        this.props.on_add_click
            ? this.props.on_add_click()
            : this.props.dispatch(Groups.actions.ui_open_dialog('create'));
    }

    public on_remove_click() {
        this.props.on_remove_click
            ? this.props.on_remove_click()
            : this.props.dispatch(Groups.actions.ui_open_dialog('delete'));
    }

    public render() {
        const { classes } = this.props;
        const groups = this.props.groups
            .filter(group => group.name.indexOf(this.props.search_text) > -1)
            .sort(Core.utils.alphabetically);

        return (
            <div>
                <Core.components.ListToolbar
                    on_add_click={this.on_add_click}
                    on_remove_click={this.on_remove_click}
                    title={Core.i18n.t('groups')}
                />
                <div
                    className={classes.listContent}
                    ref={ref => (this.scrollParentRef = ref)}
                >
                    <InfiniteScroll
                        pageStart={1}
                        loadMore={this.load_more}
                        hasMore={
                            this.state.page * ITEMS_PER_PAGE < groups.length
                        }
                        threshold={20}
                        loader={<div className="loader" key={0} />}
                        getScrollParent={() => this.scrollParentRef}
                        useWindow={false}
                    >
                        {groups.length === 0 ? (
                            <div className={'groups_empty-list'}>
                                <Typography
                                    className={classes.message}
                                    component="h5"
                                    variant="h5"
                                    align="center"
                                >
                                    {Core.i18n.t('users.list_empty')}
                                </Typography>
                                <div className={classes.center}>
                                    <Button
                                        onClick={this.props.on_add_click}
                                        variant="contained"
                                        color="primary"
                                    >
                                        {Core.i18n.t('users.add')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <List component="nav" className={classes.list}>
                                {groups
                                    .slice(0, this.state.page * ITEMS_PER_PAGE)
                                    .map(group => (
                                        <div key={group._id}>
                                            <GroupListItem group={group} />
                                            <Divider />
                                        </div>
                                    ))}
                            </List>
                        )}
                    </InfiniteScroll>
                </div>
                <GroupCreateDialog />
                <GroupDeleteDialog />
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
    )(GroupListComponent)
);
