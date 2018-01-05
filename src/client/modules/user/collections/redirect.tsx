// modules
import * as React from 'react';
import { connect } from 'react-redux';

// local
import { IState } from 'client/state';

// types
import { ICollection } from 'lib/collections/types';

// selectors
import { select_collection_by_id } from 'lib/collections/selectors';

// actions
import { get_collection } from 'lib/collections/actions';
import { push } from 'lib/ui/actions';

interface IStateProps {
    collection_id: string;
    collection: ICollection;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserCollectionsRedirect extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_collection(this.props.collection_id));
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.collection.cards[0] !== undefined) {
            this.props.dispatch(
                push(
                    '/user/collections/' +
                        this.props.collection_id +
                        '/cards/' +
                        nextProps.collection.cards[0]
                )
            );
        }
    }

    public render() {
        return <div>loading collection {this.props.collection_id}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_id: ownProps.params.collection_id,
        collection: select_collection_by_id(
            state,
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
    UserCollectionsRedirect
);
