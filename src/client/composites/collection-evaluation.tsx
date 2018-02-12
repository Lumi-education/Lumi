// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';

import { IState } from 'client/state';
// components
import { Avatar } from 'material-ui';

import * as Collections from 'lib/collections';
import * as Users from 'lib/users';
import * as Cards from 'lib/cards';
import * as Core from 'lib/core';
import * as UI from 'lib/ui';

interface IPassedProps {
    collection_id: string;
    user_id: string;
}

interface IStateProps extends IPassedProps {
    collection: Collections.ICollection;
    card_data: Cards.ICardData[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading: boolean;
}
export class CollectionEvaluationContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false
        };
    }

    public componentWillMount() {
        if (!this.props.collection._id) {
            this.props.dispatch(
                Collections.actions.get_collection(this.props.collection_id)
            );
        }
        if (
            this.props.collection.cards.length !== this.props.card_data.length
        ) {
            this.props.dispatch(
                Core.actions.find({
                    type: 'data',
                    user_id: this.props.user_id,
                    collection_id: this.props.collection_id
                })
            );
        }
    }

    public render() {
        if (this.state.loading) {
            return <Avatar>0</Avatar>;
        }
        const grade =
            this.props.card_data.map(d => d.score).reduce((p, c) => p + c, 0) /
            this.props.collection.cards.length *
            100;

        return (
            <Avatar backgroundColor={UI.utils.get_grade_color(grade)}>
                {UI.utils.get_grade_string(grade, false)}
            </Avatar>
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
        ),
        card_data: Cards.selectors.data_query(state, {
            collection_id: ownProps.collection_id,
            user_id: ownProps.user_id
        })
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
)(CollectionEvaluationContainer);
