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
} 									from 'material-ui/BottomNavigation';

import SVGLeft 						from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import SVGRight 					from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import SVGNote 						from 'material-ui/svg-icons/av/note';
import SVGHelp 						from 'material-ui/svg-icons/action/help';
import SVGCamera 					from 'material-ui/svg-icons/image/photo-camera';
import SVGAssist 					from 'material-ui/svg-icons/image/assistant';
import SVGFlag 						from 'material-ui/svg-icons/content/flag';
import SVGOverview 					from 'material-ui/svg-icons/av/featured-play-list';

import SVGAssignment 				from 'material-ui/svg-icons/action/assignment';
import SVGAssignmentTurnIn 			from 'material-ui/svg-icons/action/assignment-turned-in';
import MenuItem 					from 'material-ui/MenuItem';
import Menu 						from 'material-ui/Menu';
import Popover 						from 'material-ui/Popover';

import Summary 						from '../components/summary';

import {
	Collection,
	get_collection
}				from '../state/collection/selector';

import {
	push,
	dialog_close,
	dialog_open
} from '../state/ui/actions';

import {
	submit_collection,
	reset_collection
} from '../state/collection/actions';

interface DispatchProps {
	dispatch: (action) => void;
}

interface StateProps {
	collection: Collection;
	material_id: string;
	dialog_show: boolean;
}

interface Props extends StateProps, DispatchProps { }

interface State {
	anchorEl?;
	open?: boolean;
}

export class WorksheetContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			anchorEl: null,
			open: false
		};
		this.handleTouchTap = this.handleTouchTap.bind(this);
	}

	handleTouchTap = (event) => {
		// This prevents ghost click.
		event.preventDefault();
	
		this.setState({
			open: true,
			anchorEl: event.currentTarget,
		});
	}

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
				<Summary
					collection={this.props.collection}
					show={this.props.dialog_show}
					push={(url: string) => this.props.dispatch( push(url) )}
					submit={() => { this.props.dispatch( submit_collection(this.props.collection.meta._id) ); }}
					dialog_close={() => this.props.dispatch( dialog_close() )}
					reset={() => this.props.dispatch( reset_collection( this.props.collection.meta._id ) )}
				/>
				<Popover 
					open={this.state.open} 
					anchorEl={this.state.anchorEl} 
					anchorOrigin={{horizontal: 'middle', vertical: 'top'}} 
					targetOrigin={{horizontal: 'middle', vertical: 'bottom'}} 
					onRequestClose={() => this.setState({ open: false })}
				>
					<Menu>
						<MenuItem 
							onClick={() => { 
								this.props.dispatch( dialog_open() );
								this.setState({ open: false}); 
							}} 
							leftIcon={<SVGAssignmentTurnIn />} 
							primaryText="Übersicht" 
						/>
					</Menu>
				</Popover>

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

						{<BottomNavigationItem onTouchTap={this.handleTouchTap} icon={<SVGAssignment />} />}

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

function mapDispatchToProps(dispatch): DispatchProps {
	return {
		dispatch: (action) => dispatch(action)
	};
}

function mapStateToProps(state: Root_State, ownProps): StateProps {
	return {
		collection: get_collection(state, ownProps.params.collection_id),
		dialog_show: state.ui.dialog_show,
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