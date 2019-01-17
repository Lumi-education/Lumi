import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { intersection } from 'lodash';

// types
import { IState } from 'client/state';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

// modules
import * as UI from 'lib/ui';
import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';
import * as Material from 'lib/material';

const log_info = debug('lumi:info:pages:admin:groups:group-flow-tab');

// actions

interface IPassedProps {
    group_id: string;
}
interface IStateProps extends IPassedProps {
    // assignments: Flow.models.Assignment[];
    users: Users.models.User[];
    material: Material.models.Material[];
    assignment: (
        user_id: string,
        material_id: string
    ) => Flow.models.Assignment;
    // group: Groups.models.Group;
    // selected_users: string[];
    // selected_assignments: string[];
    // user: (user_id: string) => Users.models.User;
    // assignment: (assignment_id: string) => Flow.models.Assignment;
    // // card: (card_id: string) => Cards.ICard;
    // selected_tags: string[];

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    error?: string;
    tags: string[];
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupAssignmentsTableTab extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            tags: []
        };
    }

    public componentWillMount() {
        log_info('componentWillMount');
    }

    public render() {
        const { material, users, classes } = this.props;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.avatarColumn}>
                                Avatar
                            </TableCell>

                            <TableCell className={classes.avatarColumn}>
                                Name
                            </TableCell>
                            {material.map(m => (
                                <TableCell
                                    key={m._id}
                                    className={classes.column}
                                >
                                    <Material.components.Avatar material={m} />{' '}
                                    <br />
                                    {m.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell
                                    className={classes.avatarColumn}
                                    component="th"
                                    scope="row"
                                >
                                    <Core.components.Avatar doc={user} />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.name}
                                </TableCell>
                                {material.map(m => {
                                    const assignment = this.props.assignment(
                                        user._id,
                                        m._id
                                    );

                                    return (
                                        <TableCell
                                            key={assignment._id}
                                            align="center"
                                        >
                                            <Checkbox
                                                checked={assignment.completed}
                                                disabled={!assignment._id}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const users = Users.selectors.users_in_group(state, ownProps.group_id);
    const group = Groups.selectors.group(state, ownProps.group_id);

    return {
        users,
        group_id: ownProps.group_id,
        material: Material.selectors.material_list(state, group.material_ids),
        assignment: (user_id: string, material_id: string) =>
            Flow.selectors.assignment_for_user_and_material(
                state,
                user_id,
                material_id
            ),
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
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 700
    },
    column: {
        maxWidth: '92px'
    },
    avatarColumn: {
        width: '50px'
    },
    test: {
        color: 'red'
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(GroupAssignmentsTableTab)
);
