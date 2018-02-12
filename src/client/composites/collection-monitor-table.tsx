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
    user_ids: string[];
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
                                    $in: this.props.user_ids
                                },
                                card_id: {
                                    $in: this.props.collection.cards
                                }
                            },
                            {
                                limit:
                                    this.props.user_ids.length *
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
                            <TableHeaderColumn>Status</TableHeaderColumn>
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
                    <TableBody preScanRows={false}>
                        {this.props.user_ids.map(user_id => (
                            <TableRow key={user_id}>
                                <TableRowColumn>
                                    <Users.container.Name user_id={user_id} />
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Users.container.OnlineStatus
                                        user_id={user_id}
                                    />
                                </TableRowColumn>

                                {this.props.collection.cards.map(card_id => (
                                    <TableRowColumn
                                        key={
                                            this.props.collection_id +
                                            user_id +
                                            card_id
                                        }
                                    >
                                        <Cards.CardEvaluationContainer
                                            user_id={user_id}
                                            collection_id={
                                                this.props.collection_id
                                            }
                                            card_id={card_id}
                                            active={false}
                                        />
                                    </TableRowColumn>
                                ))}
                                <TableRowColumn>
                                    <Collections.container.DueDate
                                        data_id={
                                            user_id +
                                            '-' +
                                            this.props.collection_id
                                        }
                                    />
                                </TableRowColumn>
                                <TableRowColumn>
                                    <CollectionEvaluation
                                        collection_id={this.props.collection_id}
                                        user_id={user_id}
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
        user_ids: ownProps.user_ids,
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
