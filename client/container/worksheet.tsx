import * as React from 'react';
import { connect } from 'react-redux';
import { State as Root_State } from '../state';

// selector
import {
	Collection,
	get_collection
}				from '../state/collection/selector';

interface StateProps {
	collection: Collection;

	query: {
		collection: string;
		material: string;
		type: string;
	};
}

interface DispatchProps {
	dispatch: (action) => void;
}

interface Props extends StateProps, DispatchProps { }

interface State { }

export class Worksheet extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	public render() { 
		return (
			<div>{this.props.collection.material_list.map(t => <div>{t.name}</div>)}</div>
		); 
	}
}

function mapStateToProps(state: Root_State, ownProps): StateProps {
	const collection = ownProps.location.query.collection;
	return {
		query: ownProps.location.query,

		collection: get_collection(state, collection)
	};
}

function mapDispatchToProps(dispatch): DispatchProps {
	return {
		dispatch: (action) => dispatch(action)
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(Worksheet);
