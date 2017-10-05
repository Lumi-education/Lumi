import * as React from 'react';
import { connect } from 'react-redux';
import { State as Root_State } from '../state';

interface Props extends StateProps, DispatchProps { }

interface State {}

export class WorksheetContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.init = this.init.bind(this);
	}

	init(props: Props) {
		// if (!props.material.meta) {
			// this.props.dispatch( create_material_meta(
			// {
			// 	_id: undefined,
			// 	type: 'material_meta',
			// 	material_id: props.material._id,
			// 	user_id: undefined,
			// 	query: props.query
			// }) );
		// }
	}

	componentWillMount() { this.init( this.props ); }
	componentWillReceiveProps(nextProps: Props) { this.init(nextProps); }

	public render() { 
		return (
			<div id="worksheet">
				{this.props.collection ? this.props.children : <div>Loading</div>}
			</div>
		); 
	}
}

// action & props-mapping
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
}				from '../state/collection/selector';

interface StateProps {
	collection: Collection;
}

function mapStateToProps(state: Root_State, ownProps): StateProps {
	return {
		collection: get_collection(state, ownProps.params.collection_id),
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(WorksheetContainer);
