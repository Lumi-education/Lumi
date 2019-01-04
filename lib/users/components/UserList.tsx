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

import UserListItem from './UserListItem';
import UserCreateDialog from './UserCreateDialog';
import UserDeleteDialog from './UserDeleteDialog';

// modules
import * as Core from 'lib/core';
import * as Users from 'lib/users';

const log_info = debug('lumi:users:components:UserList');

const ITEMS_PER_PAGE = 6;

interface IPassedProps {
    users: Users.models.User[];

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
        this.props.on_add_click
            ? this.props.on_add_click()
            : this.props.dispatch(Users.actions.ui_show_dialog('create'));
    }

    public on_remove_click() {
        this.props.on_remove_click
            ? this.props.on_remove_click()
            : this.props.dispatch(Users.actions.ui_show_dialog('delete'));
    }

    public render() {
        const { classes } = this.props;
        const users = this.props.users
            .filter(user => user.name.indexOf(this.props.search_text) > -1)
            .sort(Core.utils.alphabetically);

        return (
            <div>
                <Core.components.ListToolbar
                    on_add_click={this.on_add_click}
                    on_remove_click={this.on_remove_click}
                    title={Core.i18n.t('users')}
                />
                <div
                    className={classes.listContent}
                    ref={ref => (this.scrollParentRef = ref)}
                >
                    <InfiniteScroll
                        pageStart={1}
                        loadMore={this.load_more}
                        hasMore={
                            this.state.page * ITEMS_PER_PAGE < users.length
                        }
                        threshold={20}
                        loader={<div className="loader" key={0} />}
                        getScrollParent={() => this.scrollParentRef}
                        useWindow={false}
                    >
                        {users.length === 0 ? (
                            <div>
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
                                {users
                                    .slice(0, this.state.page * ITEMS_PER_PAGE)
                                    .map(user => (
                                        <div key={user._id}>
                                            <UserListItem user={user} />
                                            <Divider />
                                        </div>
                                    ))}
                            </List>
                        )}
                    </InfiniteScroll>
                </div>
                <UserCreateDialog />
                <UserDeleteDialog />
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
