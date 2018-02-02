// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';

import { TableRow, TableRowColumn } from 'material-ui';

// local
import { IState } from 'client/state';
import SVGCheck from 'material-ui/svg-icons/navigation/check';
import SVGClose from 'material-ui/svg-icons/navigation/close';
// types
import * as Users from 'lib/users';
import * as Data from 'lib/data';
import * as Collections from 'lib/collections';
import * as Cards from 'lib/cards';
import * as Core from 'lib/core';

interface IPassedProps {
    collection_id: string;
    user_id: string;
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
export class CardEvaluationContainer extends React.Component<
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
                Core.actions.find({
                    type: 'data',
                    user_id: this.props.user_id,
                    collection_id: this.props.collection_id
                })
            )
            .then(res => {
                this.setState({ loading: false });
            });

        this.props.dispatch(
            Collections.actions.get_collection(this.props.collection_id)
        );
    }

    public render() {
        if (this.state.loading) {
            return <div>loading</div>;
        }
        return (
            <TableRow>
                <TableRowColumn>
                    <Users.container.Name user_id={this.props.user_id} />
                </TableRowColumn>
                {this.props.collection.cards.map((card_id, i) => (
                    <TableRowColumn>
                        <Cards.CardEvaluationContainer
                            user_id={this.props.user_id}
                            collection_id={this.props.collection_id}
                            card_id={card_id}
                        />
                    </TableRowColumn>
                ))}
            </TableRow>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user_id: ownProps.user_id,
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
)(CardEvaluationContainer);
