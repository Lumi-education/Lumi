import * as React from 'react';
import { connect } from 'react-redux';
import { State as Root_State } from '../state';

import { 
	last, 
	first
} 	from 'lodash';

import {
	BottomNavigation,
	BottomNavigationItem,
} 						from 'material-ui/BottomNavigation';
import SVGLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import SVGRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

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
				{
					this.props.collection 
					? 
					this.props.children 
					: 
					<div>Loading worksheet</div>
				}
				<BottomNavigation style={{ position: 'fixed', bottom: '0px', left: '0px', right: '0px', zIndex: 501 }}>
						<BottomNavigationItem 
							style={{
								display: first(this.props.collection.material) !== this.props.material_id ? 'block' : 'none'
							}} 
							onClick={() => this.props.dispatch( 
								push('/worksheet/' + this.props.collection._id + '/material/' + 
								prev(this.props.collection.material, this.props.material_id))
							)}
							icon={<SVGLeft />} 
						/>

						{/* <BottomNavigationItem onTouchTap={this.handleTouchTap} icon={<SVGAssignment />} /> */}

						<BottomNavigationItem 
							style={{display: 
								last(this.props.collection.material) !== this.props.material_id
								? 
								'block' : 'none'
							}} 
							onClick={() => this.props.dispatch( 
								push('/worksheet/' + this.props.collection._id + '/material/' + 
								next(this.props.collection.material, this.props.material_id))
							)}
							icon={<SVGRight />} 
						/>
					</BottomNavigation>
			</div>
		); 
	}
}

// action & props-mapping

import {
	push 
} from '../state/ui/actions';

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
	material_id: string;
}

function mapStateToProps(state: Root_State, ownProps): StateProps {
	return {
		collection: get_collection(state, ownProps.params.collection_id),
		material_id: ownProps.params.material_id
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(WorksheetContainer);

function next(array: string[], id: string): string {
	let index = array.indexOf(id);
	index = index + 1;
	return array[ index ];
}

function prev(array: string[], id: string): string {
	let index = array.indexOf(id);
	index = index - 1;
	return array[ index ];
}