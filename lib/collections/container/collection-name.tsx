// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

// local
import { IState } from 'client/state';

// types
import * as Collections from '../';

interface IPassedProps {
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    collection: Collections.ICollection;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionNameContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.collection._id) {
            this.props.dispatch(
                Collections.actions.get_collections([this.props.collection_id])
            );
        }
    }

    public render() {
        if (!this.props.collection._id) {
            return <div>loading ...</div>;
        }
        return <div>{this.props.collection.name}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection: Collections.selectors.select_collection_by_id(
            state,
            ownProps.collection_id
        ),
        collection_id: ownProps.collection_id
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
)(CollectionNameContainer);
