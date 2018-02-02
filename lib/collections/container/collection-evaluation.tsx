// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import { Map } from 'immutable';

import * as markdownit from 'markdown-it';
const md = markdownit();

// components
import CollectionEvaluationComponent from '../components/collection-evaluation';

// local
import { IState } from '../../../src/client/state';

// types
import { IData, ICollectionData } from 'lib/cards/types';
import { ICollection } from 'lib/collections/types';

// selectors
import { select_data_for_user_and_collection } from 'lib/data/selectors';
import { select_collection_by_id } from 'lib/collections/selectors';

// actions
import { get_data } from 'lib/data/actions';

import { Dialog } from 'material-ui';

interface IPassedProps {
    collection_id: string;
    user_id?: string;
}
interface IStateProps extends IPassedProps {
    data: IData[];
    collection: ICollection;
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
        const percent: number = parseInt(
            (
                this.correct() /
                this.props.data.filter(
                    d => d.data_type === 'card' && d.card_type !== 'video'
                ).length *
                100
            ).toFixed(0),
            10
        );

        return (
            <CollectionEvaluationComponent
                correct={this.correct()}
                num={
                    this.props.data.filter(
                        d => d.data_type === 'card' && d.card_type !== 'video'
                    ).length
                }
                msg={(() => {
                    try {
                        return this.props.collection.submit_messages
                            .filter(sm => percent >= sm.score)
                            .sort((a, b) => (a.score < b.score ? 1 : 0))[0].msg;
                    } catch (err) {
                        return '# Abgegeben';
                    }
                })()}
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || state.auth.user_id;
    return {
        user_id,
        collection_id: ownProps.collection_id,
        collection: select_collection_by_id(state, ownProps.collection_id),
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
