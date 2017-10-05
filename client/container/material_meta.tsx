import * as React from 'react';
import { connect } from 'react-redux';
import { State as Root_State } from '../state';

interface Props extends StateProps, DispatchProps { }

interface State {}

export class MaterialMetaContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.init = this.init.bind(this);
	}

	init(props: Props) {
		if (!props.material.meta && props.material.material_type) {
			let meta;
			meta = {
						_id: undefined,
						type: 'material_meta',
						material_id: props.material._id,
						user_id: undefined,
						query: {
							collection: props.collection_id,
							type: 'worksheet'
						},
						value: shuffle(props.material.items),
						score: 0
					};
			// 		break;
			// }

			this.props.dispatch( create_material_meta( meta ) );
		}
	}

	componentWillMount() { this.init( this.props ); }
	componentWillReceiveProps(nextProps: Props) { this.init(nextProps); }

	public render() { 
		return (
			<div id="material_meta">
			{
				this.props.material.meta 
				? 
				this.props.children
				: 
				<div>Loading meta</div>
			}
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
	Material,
	get_material
} 				from '../state/material/selector';

interface StateProps {
	material: Material;
	collection_id: string;
}

function mapStateToProps(state: Root_State, ownProps): StateProps {
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
)(MaterialMetaContainer);

function shuffle(a: string[]): string[] {
	const array = a.slice(0); // copy array
	let counter = array.length;
  
	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		const index = Math.floor(Math.random() * counter);
  
		// Decrease counter by 1
		counter--;
  
		// And swap the last element with it
		const temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
  
	return array;
  }
  