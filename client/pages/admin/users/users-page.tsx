// modules
import * as React from 'react';
import { connect } from 'react-redux';

import * as InfiniteScroll from 'react-infinite-scroller';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import ContentAdd from 'material-ui/svg-icons/content/add';

import CreateUserDialog from 'lib/users/components/UserCreateDialog';
import AssignGroupDialog from 'client/dialogs/groups-assign-dialog';

// state
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as Groups from 'lib/groups';
import { push } from 'lib/ui/actions';

interface IStateProps {
    users: Users.models.User[];
    group: (group_id) => Groups.models.Group;
    selected_users: string[];

    search_text: string;
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    page: number;
}

export class AdminUsers extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            page: 1
        };

        this.load_more = this.load_more.bind(this);
    }

    public componentWillUnmount() {
        this.props.dispatch(Users.actions.selection_reset());
    }

    public load_more(page: number) {
        this.setState({ page });
    }

    public render() {
        const { users } = this.props;
        return (
            <div id="users-page">
                <Core.components.AppBar title={Core.i18n.t('users')} />
                <Core.components.Content>
                    <Users.components.List users={users} />
                </Core.components.Content>
                <AssignGroupDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: state.users.list,
        group: group_id => Groups.selectors.group(state, group_id),
        selected_users: state.users.ui.selected_users,
        search_text: state.ui.search_filter_text,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(AdminUsers)
);
