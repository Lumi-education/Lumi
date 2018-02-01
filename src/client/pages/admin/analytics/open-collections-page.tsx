// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as debug from 'debug';

// components
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui';

// state
import { IState } from 'client/state';

// modules
import * as Cards from 'lib/cards';
import * as Collections from 'lib/collections';
import * as Data from 'lib/data';
import * as core from 'lib/core';
import * as Users from 'lib/users';

const log = debug('lumi:client:admin:collections:collection-page');

interface IStateProps {
    collections: Cards.ICollectionData[];
}

interface IDispatchProps {
    dispatch: (action) => any;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminOpenCollectionsPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(
            core.actions.find({ data_type: 'collection', submitted: false })
        );
    }

    public render() {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>User</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Due Date</TableHeaderColumn>
                        <TableHeaderColumn>Submitted</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {this.props.collections.map(c => (
                        <TableRow>
                            <TableRowColumn>
                                <Users.container.Name user_id={c.user_id} />
                            </TableRowColumn>
                            <TableRowColumn>
                                <Collections.container.Name
                                    collection_id={c.collection_id}
                                />
                            </TableRowColumn>
                            <TableRowColumn>
                                <Collections.container.DueDate
                                    data_id={c._id}
                                />
                            </TableRowColumn>
                            <TableRowColumn>
                                <Collections.container.Submitted
                                    data_id={c._id}
                                />
                            </TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collections: Collections.selectors.data_query(state, {
            submitted: false
        })
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
)(AdminOpenCollectionsPage);
