import * as React from 'react';
import { connect } from 'react-redux';
import { State as Root_State } from '../state';

import SortComponent 		from '../components/material/sort';

import { Sort } 			from '../state/material/types';

interface Props extends StateProps, DispatchProps { }

interface State {}

export class MaterialContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.init = this.init.bind(this);
	}

	init(props: Props) {
		if (!props.material.meta) {
			this.props.dispatch( create_material_meta(
			{
				_id: undefined,
				type: 'material_meta',
				material_id: props.material._id,
				user_id: undefined,
				query: props.query
			}) );
		}
	}

	componentWillMount() { this.init( this.props ); }
	componentWillReceiveProps(nextProps: Props) { this.init(nextProps); }

	public render() { 
		const sort: Sort  = this.props.material as any;
		return (
			<div>
				<SortComponent 
					task={sort.task}
					items={sort.items}
					cb={(items) => { console.log(items) }}
				/>
			</div>
		); 
	}
}

// action & props-mapping
import {
	create_material_meta
} 							from '../state/material/actions';

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

import {
	Material,
	get_material
} 				from '../state/material/selector';

interface StateProps {
	collection: Collection;
	material: Material;

	query: {
		collection: string;
		material: string;
		type: string;
	};
}

function mapStateToProps(state: Root_State, ownProps): StateProps {
	const query = ownProps.location.query;
	return {
		query: ownProps.location.query,

		collection: get_collection(state, query.collection),
		material: get_material(state, query.material, query)
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(MaterialContainer);
