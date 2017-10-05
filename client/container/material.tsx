import * as React from 'react';
import { connect } from 'react-redux';
import { State as Root_State } from '../state';

import SortComponent 			from '../components/material/sort';

import { Sort } 				from '../state/material/types';

interface Props extends StateProps, DispatchProps { }

interface State {}

export class MaterialContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	public render() { 
		return (
			<div id="material">
			{
				this.props.material && this.props.material.meta 
				? 
				(() => {
					switch ( this.props.material.material_type ) {
						case 'sort':
							return (
								<SortComponent 
									task={this.props.material.task} 
									items={this.props.material.meta.value} 
									cb={(items) => { 
										this.props.dispatch( material_meta_update(this.props.material.meta._id, { value: items })); 
										}
									} 
								/>
								);
						default:
							return <div>Bitte warten.</div>;
					}
				})()
				: 
				<div>Loading material</div>
			}
			</div>
		); 
	}
}

// action & props-mapping
import {
	create_material_meta,
	material_meta_update
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
	Material,
	get_material
} 				from '../state/material/selector';

interface StateProps {
	material: Material;
	collection_id: string;
}

function mapStateToProps(state: Root_State, ownProps): StateProps {
	const query = ownProps.location.query;
	return {
		material: get_material(state, ownProps.params.material_id, { 
			collection: ownProps.params.collection_id, 
			type: 'worksheet' 
		}),
		collection_id: ownProps.params.collection_id
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(MaterialContainer);
