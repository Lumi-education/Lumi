// modules
import * as React from 'react';
import { connect } from 'react-redux';

// local
import { IState } from 'client/state';

// types

// actions
import { get_collection } from 'client/packages/collections/actions';
import { get_user_collection_data } from 'client/packages/data/actions';

interface IStateProps {
    collection_id: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserCollections extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_collection(this.props.collection_id));
        this.props.dispatch(get_user_collection_data(this.props.collection_id));
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (this.props.collection_id !== nextProps.collection_id) {
            this.props.dispatch(get_collection(nextProps.collection_id));
            this.props.dispatch(
                get_user_collection_data(nextProps.collection_id)
            );
        }
    }

    public render() {
        return <div>{this.props.children}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_id: ownProps.params.collection_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserCollections
);
