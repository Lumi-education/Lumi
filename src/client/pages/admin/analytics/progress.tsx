// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

// components
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGCheck from 'material-ui/svg-icons/navigation/check';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { sum } from 'lib/core/utils';
import { get_grade_color } from 'lib/ui/utils';
// local
import { IState } from 'client/state';

// types
import { ICollection } from 'lib/collections/types';
import { IUser } from 'lib/users';
import { ICard } from 'lib/cards/types';
import { IGroup } from 'lib/groups';

// selectors
import {
    select_collection_by_id,
    select_collections_as_array
} from 'lib/collections/selectors';

import { select_cards_by_ids } from 'lib/cards/selectors';

import { get_users_by_group } from 'lib/users/selectors';
import { select_data_as_map } from 'lib/data/selectors';
import { groups_list } from 'lib/groups/selectors';
// actions
import { get_collections, get_collection } from 'lib/collections/actions';
import { get_groups, get_group } from 'lib/groups/actions';
import { get_data } from 'lib/data/actions';

interface IStateProps {
    collection: ICollection;
    collections: ICollection[];
    collection_id: string;
    group_id: string;
    cards: ICard[];
    groups: IGroup[];
    users: IUser[];
    data;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminCollectionProgress extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (this.props.collection_id !== nextProps.collection_id) {
            this.props.dispatch(get_collection(nextProps.collection_id));
            this.props.dispatch(
                get_data({
                    collection_id: this.props.collection_id
                })
            );
        }

        if (this.props.group_id !== nextProps.group_id) {
            this.props.dispatch(get_group(nextProps.group_id));
        }
    }

    public componentWillMount() {
        this.props.dispatch(get_groups());
        this.props.dispatch(get_collections());
        this.props.dispatch(get_collection(this.props.collection_id));
        this.props.dispatch(
            get_data({ collection_id: this.props.collection_id })
        );
        this.props.dispatch(get_group(this.props.group_id));
    }

    public render() {
        return (
            <div>
                <Paper
                    zDepth={1}
                    style={{
                        position: 'fixed',
                        backgroundColor: '#FFFFFF',
                        top: '64px',
                        zIndex: 1099,
                        width: '100%'
                    }}
                >
                    <SelectField
                        floatingLabelText="Group"
                        value={this.props.group_id}
                        onChange={(e, i, v) =>
                            this.props.dispatch(
                                push(
                                    '/admin/analytics/progress?group_id=' +
                                        v +
                                        '&collection_id=' +
                                        this.props.collection_id
                                )
                            )
                        }
                    >
                        {this.props.groups.map(group => (
                            <MenuItem
                                value={group._id}
                                primaryText={group.name}
                            />
                        ))}
                    </SelectField>
                    <SelectField
                        floatingLabelText="Collection"
                        value={this.props.collection_id}
                        onChange={(e, i, v) =>
                            this.props.dispatch(
                                push(
                                    '/admin/analytics/progress?group_id=' +
                                        this.props.group_id +
                                        '&collection_id=' +
                                        v
                                )
                            )
                        }
                    >
                        {this.props.collections.map(collection => (
                            <MenuItem
                                value={collection._id}
                                primaryText={collection.name}
                            />
                        ))}
                    </SelectField>
                </Paper>
                <Paper>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                {this.props.cards.map((card, i) => (
                                    <TableHeaderColumn>
                                        {i + 1}.
                                    </TableHeaderColumn>
                                ))}
                                <TableRowColumn>Performance</TableRowColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {this.props.users.map(user => {
                                return (
                                    <TableRow>
                                        <TableRowColumn>
                                            {user.name}
                                        </TableRowColumn>
                                        {this.props.cards.map((card, i) => {
                                            const data = this.props.data.filter(
                                                d =>
                                                    d.card_id === card._id &&
                                                    user._id === d.user_id
                                            )[0];
                                            if (!data) {
                                                return (
                                                    <TableRowColumn>
                                                        <Checkbox
                                                            disabled={true}
                                                        />
                                                    </TableRowColumn>
                                                );
                                            }
                                            return (
                                                <TableRowColumn>
                                                    <Checkbox
                                                        checkedIcon={
                                                            data.score ? (
                                                                <SVGCheck />
                                                            ) : (
                                                                <SVGClose />
                                                            )
                                                        }
                                                        checked={true}
                                                        iconStyle={{
                                                            fill: data.score
                                                                ? 'green'
                                                                : 'red'
                                                        }}
                                                    />
                                                </TableRowColumn>
                                            );
                                        })}
                                        {(() => {
                                            const correct_answers = this.props.data
                                                .filter(
                                                    data =>
                                                        data.user_id ===
                                                        user._id
                                                )
                                                .map(data => data.score || 0)
                                                .reduce(sum, 0);
                                            const num_answers = this.props
                                                .collection.cards.length;
                                            const grade =
                                                correct_answers /
                                                num_answers *
                                                100;
                                            return (
                                                <TableRowColumn
                                                    style={{
                                                        backgroundColor: get_grade_color(
                                                            grade
                                                        )
                                                    }}
                                                >
                                                    {grade} %
                                                </TableRowColumn>
                                            );
                                        })()}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const collection_id = ownProps.location.query.collection_id;
    const group_id = ownProps.location.query.group_id;

    return {
        collection_id,
        group_id,
        collection: select_collection_by_id(state, collection_id),
        collections: select_collections_as_array(state),
        cards: select_cards_by_ids(
            state,
            select_collection_by_id(state, collection_id).cards
        ),
        groups: groups_list(state),
        users: get_users_by_group(state, group_id),
        data: select_data_as_map(state)
            .toArray()
            .filter(d => (d as any).collection_id === collection_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminCollectionProgress
);