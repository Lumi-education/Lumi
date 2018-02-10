// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';

import CollectionEvaluation from './collection-evaluation';

// components
import {
    Paper,
    Table,
    TableHeader,
    TableBody,
    TableRowColumn,
    TableRow,
    TableHeaderColumn
} from 'material-ui';

import * as Collections from 'lib/collections';
import * as Users from 'lib/users';
import * as Cards from 'lib/cards';
import * as Core from 'lib/core';

interface IPassedProps {
    collection_id: string;
    users: Users.IUser[];
}

interface IStateProps extends IPassedProps {
    collection: Collections.ICollection;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading: boolean;
}
export class CollectionTableHeaderContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    public componentWillMount() {
        this.props
            .dispatch(
                Collections.actions.get_collection(this.props.collection_id)
            )
            .then(r => {
                this.props.dispatch(
                    Cards.actions.get_cards(this.props.collection.cards)
                );
            })
            .then(r => {
                this.props
                    .dispatch(
                        Core.actions.find(
                            {
                                type: 'data',
                                collection_id: this.props.collection_id,
                                user_id: {
                                    $in: this.props.users.map(u => u._id)
                                },
                                card_id: {
                                    $in: this.props.collection.cards
                                }
                            },
                            {
                                limit:
                                    this.props.users.length *
                                    this.props.collection.cards.length
                            }
                        )
                    )
                    .then(res => {
                        this.setState({ loading: false });
                    });
            });
    }

    public render() {
        if (this.state.loading) {
            return (
                <Paper>
                    <h1>Loading ... </h1>
                </Paper>
            );
        }
        return (
            <Paper>
                <h1>
                    <Collections.container.Name
                        collection_id={this.props.collection_id}
                    />
                </h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>User</TableHeaderColumn>
                            {this.props.collection.cards.map((c, i) => (
                                <TableHeaderColumn
                                    key={this.props.collection_id + i}
                                >
                                    {i + 1}
                                </TableHeaderColumn>
                            ))}
                            <TableHeaderColumn>Due</TableHeaderColumn>
                            <TableHeaderColumn>Score</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {this.props.users.map(user => (
                            <TableRow key={user._id}>
                                <TableRowColumn>
                                    <Users.container.Name user_id={user._id} />
                                </TableRowColumn>
                                {this.props.collection.cards.map(card_id => (
                                    <TableRowColumn
                                        key={
                                            this.props.collection_id +
                                            user._id +
                                            card_id
                                        }
                                    >
                                        <Cards.CardEvaluationContainer
                                            user_id={user._id}
                                            collection_id={
                                                this.props.collection_id
                                            }
                                            card_id={card_id}
                                            active={
                                                Users.utils.get_card_id(
                                                    user.location
                                                ) === card_id
                                            }
                                        />
                                    </TableRowColumn>
                                ))}
                                <TableRowColumn>
                                    <Collections.container.DueDate
                                        data_id={
                                            user._id +
                                            '-' +
                                            this.props.collection_id
                                        }
                                    />
                                </TableRowColumn>
                                <TableRowColumn>
                                    <CollectionEvaluation
                                        collection_id={this.props.collection_id}
                                        user_id={user._id}
                                    />
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

function mapStateToProps(state: Collections.IState, ownProps): IStateProps {
    return {
        users: ownProps.users,
        collection_id: ownProps.collection_id,
        collection: Collections.selectors.select_collection_by_id(
            state,
            ownProps.collection_id
        )
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(CollectionTableHeaderContainer);
