// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Paper, RaisedButton } from 'material-ui';

import { CollectionEvaluationContainer } from 'lib/collections';

// local
import { IState } from 'client/state';

// types
import { IData } from 'lib/cards/types';

// actions
import {
    get_collection,
    submit_collection
} from 'lib/collections/actions';
import { get_user_collection_data } from 'lib/data/actions';
import { push, set_appbar_title } from 'lib/ui/actions';

// selectors
import {
    IUserCollection,
    select_collection_for_user
} from 'lib/collections/selectors';

import { select_data_for_user_and_collection } from 'lib/data/selectors';

interface IStateProps {
    collection_id: string;
    collection: IUserCollection;
    data: IData[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserCollectionSummary extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this._cards = this._cards.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(set_appbar_title('Auswertung'));
    }

    public _cards(): number {
        return this.props.data.length;
    }

    public render() {
        if (!this.props.collection) {
            return <div>loading</div>;
        }
        return (
            <div>
                <Paper style={{ padding: '10px' }}>
                    {this.props.collection.submitted ? (
                        <div>
                            <CollectionEvaluationContainer
                                collection_id={this.props.collection_id}
                            />
                        </div>
                    ) : (
                        'Du hast ' +
                        this._cards() +
                        ' von ' +
                        this.props.collection.cards.length +
                        ' Aufgaben bearbeitet. Eine Auswertung erhälst du erst, wenn du das Arbeitsblat abgegeben hast.'
                    )}
                </Paper>
                <RaisedButton
                    label="Zurück"
                    fullWidth={true}
                    primary={true}
                    onClick={() =>
                        this.props.dispatch(
                            push(
                                '/user/collections/' + this.props.collection_id
                            )
                        )
                    }
                />
                <RaisedButton
                    label="Abgeben"
                    disabled={
                        this._cards() < this.props.collection.cards.length ||
                        this.props.collection.submitted
                    }
                    fullWidth={true}
                    secondary={true}
                    onClick={() =>
                        this.props.dispatch(
                            submit_collection(this.props.collection_id)
                        )
                    }
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = state.auth.user_id;

    return {
        collection_id: ownProps.params.collection_id,
        collection: select_collection_for_user(
            state,
            ownProps.params.collection_id
        ),
        data: select_data_for_user_and_collection(
            state,
            user_id,
            ownProps.params.collection_id
        )
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserCollectionSummary
);