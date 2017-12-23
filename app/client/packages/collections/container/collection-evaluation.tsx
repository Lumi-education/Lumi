// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import { Map } from 'immutable';

// components
import CollectionEvaluationComponent from '../components/collection-evaluation';

// local
import { IState } from 'client/state';

// types
import { IData, ICollectionData } from 'client/packages/cards/types';

// selectors
import { select_data_for_user_and_collection } from 'client/packages/data/selectors';

// actions
import { get_data } from 'client/packages/data/actions';

import { Dialog } from 'material-ui';

interface IPassedProps {
    collection_id: string;
    user_id?: string;
}
interface IStateProps extends IPassedProps {
    data: IData[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionEvaluationContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.correct = this.correct.bind(this);
    }

    public componentWillMount() {
        if (this.props.data.length === 0) {
            this.props.dispatch(
                get_data({
                    collection_id: this.props.collection_id,
                    user_id: this.props.user_id
                })
            );
        }
    }

    public correct(): number {
        return this.props.data
            .filter(d => d.data_type === 'card' && d.card_type !== 'video')
            .reduce((p, a) => p + (a.score || 0), 0);
    }

    public render() {
        return (
            <CollectionEvaluationComponent
                correct={this.correct()}
                num={
                    this.props.data.filter(
                        d => d.data_type === 'card' && d.card_type !== 'video'
                    ).length
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || state.auth.user_id;
    return {
        user_id,
        collection_id: ownProps.collection_id,
        data: select_data_for_user_and_collection(
            state,
            user_id,
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
)(CollectionEvaluationContainer);
