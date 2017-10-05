import * as React from 'react';
import { connect } from 'react-redux';
import { State as Root_State } from '../state';

interface Props extends StateProps, DispatchProps { }

interface State {}

export class CollectionMetaContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.init = this.init.bind(this);
	}

	init(props: Props) {
		if (!props.collection.meta && props.collection.name) {
			this.props.dispatch( collection_create_meta( props.collection._id ) );
		}
	}

	componentWillMount() { this.init( this.props ); }
	componentWillReceiveProps(nextProps: Props) { this.init(nextProps); }

	public render() { 
		return (
			<div id="collection_meta">
			{
				this.props.collection.meta 
				? 
				this.props.children
				: 
				<div>Loading collection meta</div>
			}
			</div>
		); 
	}
}

// action & props-mapping
import {
	collection_create_meta
} 							from '../state/collection/actions';

interface DispatchProps {
	dispatch: (action) => void;
}

function mapDispatchToProps(dispatch): DispatchProps {
	return {
		dispatch: (action) => dispatch(action)
	};
}

// selector & state-mapping
import {
	Collection,
	get_collection
} 				from '../state/collection/selector';

interface StateProps {
	collection: Collection;
}

function mapStateToProps(state: Root_State, ownProps): StateProps {
	return {
		collection: get_collection( state, ownProps.params.collection_id )
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(CollectionMetaContainer);