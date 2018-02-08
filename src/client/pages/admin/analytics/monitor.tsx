// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { uniq } from 'lodash';
import { push } from 'lib/ui/actions';
import * as debug from 'debug';

// components
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    FloatingActionButton,
    Paper
} from 'material-ui';

import ActionBar from 'lib/ui/components/action-bar';
import SVGDone from 'material-ui/svg-icons/action/done';
import SVGClose from 'material-ui/svg-icons/navigation/close';

import LoadingPage from 'lib/ui/components/loading-page';

// state
import { IState } from 'client/state';

// modules
import * as Cards from 'lib/cards';
import * as Collections from 'lib/collections';
import * as Data from 'lib/data';
import * as Core from 'lib/core';
import * as Users from 'lib/users';

const log = debug('lumi:pages:admin:analytics:monitor');

interface IStateProps {
    collection_data: Collections.ICollectionData[];
    collections: Collections.ICollection[];
    selected_collection_data: string[];
    users: Users.IUser[];
}

interface IDispatchProps {
    dispatch: (action) => any;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading: boolean;
}

export class AdminMonitorPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false
        };
    }

    public componentWillMount() {
        this.setState({ loading: true });

        this.props
            .dispatch(
                Core.actions.find({ data_type: 'collection', submitted: false })
            )
            .then(res => {
                this.props
                    .dispatch(
                        Collections.actions.get_collections(
                            res.payload.map(d => d.collection_id)
                        )
                    )
                    .then(r => {
                        this.setState({ loading: false });
                    });
            });
    }

    public render() {
        if (this.state.loading) {
            return <LoadingPage />;
        }

        const collection_ids = uniq(
            this.props.users.map(u => u.location.split('/')[3]).filter(id => id)
        );

        if (collection_ids.length === 0) {
            return <Paper>There are no users in any collections.</Paper>;
        }
        return (
            <div>
                {collection_ids.map(id => (
                    <Paper>
                        <h1>
                            <Collections.container.Name collection_id={id} />
                        </h1>
                        <Table>
                            <TableHeader
                                displaySelectAll={false}
                                adjustForCheckbox={false}
                            >
                                <TableRow>
                                    <TableHeaderColumn>User</TableHeaderColumn>
                                    {this.props.collections
                                        .filter(c => c._id === id)[0]
                                        .cards.map((card_id, i) => (
                                            <TableHeaderColumn>
                                                {i + 1}
                                            </TableHeaderColumn>
                                        ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.users
                                    .filter(
                                        user => user.location.indexOf(id) > -1
                                    )
                                    .map(u => (
                                        <TableRow>
                                            <TableRowColumn>
                                                {u.name}
                                            </TableRowColumn>
                                            {this.props.collections
                                                .filter(c => c._id === id)[0]
                                                .cards.map((card_id, i) => (
                                                    <TableRowColumn>
                                                        <Cards.CardEvaluationContainer
                                                            user_id={u._id}
                                                            collection_id={id}
                                                            card_id={card_id}
                                                        />
                                                    </TableRowColumn>
                                                ))}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Paper>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        users: Users.selectors.query(state, { online: true, level: 1 }),
        collection_data: Collections.selectors.data_query(state, {
            submitted: false
        }),
        selected_collection_data: state.collections.ui.selected_collection_data,
        collections: Collections.selectors.query(state, {})
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        push: (url: string) => dispatch(push(url))
    };
}

export default connect<{}, {}, { collection_id: string }>(
    mapStateToProps,
    mapDispatchToProps
)(AdminMonitorPage);
