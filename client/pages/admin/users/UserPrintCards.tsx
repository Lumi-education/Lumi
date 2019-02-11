// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import * as qs from 'query-string';
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
    classes?: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminUsers extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const { users, classes } = this.props;
        return (
            <div id="users-page" className={classes.root}>
                {users.map(user => (
                    <Users.components.UserPrintCard
                        key={user._id}
                        username={user.name}
                        password={user.password}
                        url={
                            window.location.origin +
                            '/' +
                            window.location.pathname.split('/')[1]
                        }
                    />
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_ids =
        JSON.parse(qs.parse(ownProps.location.search).user_ids) || [];
    return {
        users: Users.selectors.users(state, user_ids),
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: 'white'
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(AdminUsers)
);
