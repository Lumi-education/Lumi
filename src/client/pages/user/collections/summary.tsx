// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Paper, RaisedButton } from 'material-ui';

import * as moment from 'moment-timezone';
// local
import { IState } from 'client/state';

// types
import { IData } from 'lib/cards/types';

// actions
import { get_collection, submit_collection } from 'lib/collections/actions';
import { push, set_appbar_title } from 'lib/ui/actions';

// selectors
import {
    IUserCollection,
    select_collection_for_user
} from 'lib/collections/selectors';

// modules
import * as Grades from 'lib/grades';
import * as Collections from 'lib/collections';
import * as Cards from 'lib/cards';

interface IStateProps {
    user_id: string;
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
        this._grade = this._grade.bind(this);
        this._graded_tasks = this._graded_tasks.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(set_appbar_title('Auswertung'));
    }

    public _cards(): number {
        return this.props.data.filter(
            d =>
                d.data_type === 'card' &&
                d.card_type !== 'video' &&
                d.card_type !== 'text'
        ).length;
    }

    public _grade(): number {
        const correct = this.props.data
            .filter(
                d =>
                    d.data_type === 'card' &&
                    d.card_type !== 'video' &&
                    d.card_type !== 'text'
            )
            .reduce((p, a) => p + (a.score || 0), 0);

        return correct / this._graded_tasks();
    }

    public _graded_tasks(): number {
        return this.props.data.filter(
            d =>
                d.data_type === 'card' &&
                d.card_type !== 'text' &&
                d.card_type !== 'video'
        ).length;
    }

    public render() {
        if (!this.props.collection) {
            return <div>loading</div>;
        }
        return (
            <div>
                {this.props.collection.due_date ? (
                    <Paper style={{ padding: '10px' }}>
                        {' '}
                        Dieses Arbeitsblatt wird automatisch abgegeben. ({moment(
                            this.props.collection.due_date
                        )
                            .tz('Europe/Berlin')
                            .fromNow()})
                    </Paper>
                ) : (
                    <Paper style={{ padding: '10px' }}>
                        {this.props.collection.submitted ? (
                            <div>
                                {this.props.collection.is_graded
                                    ? '...'
                                    : 'Danke'}
                            </div>
                        ) : this.props.collection.is_graded ? (
                            'Du hast ' +
                            this._cards() +
                            ' von ' +
                            this._graded_tasks() +
                            ' Aufgaben bearbeitet. Eine Auswertung erhälst du erst, wenn du das Arbeitsblat abgegeben hast.'
                        ) : (
                            'Die Aufgaben müssen schriftlich abgegeben werden'
                        )}
                    </Paper>
                )}
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
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = state.auth.user_id;

    return {
        user_id,
        collection_id: ownProps.params.collection_id,
        collection: select_collection_for_user(
            state,
            ownProps.params.collection_id
        ),
        data: Cards.selectors.data_query(state, {
            user_id,
            collection_id: ownProps.params.collection_id
        }) as IData[]
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
