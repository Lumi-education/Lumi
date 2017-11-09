// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';
import { push } 			from 'react-router-redux';

import { Map } 				from 'immutable';
import { assign } 			from 'lodash';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Chip 				from 'material-ui/Chip';

import FlatButton 			from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { List, ListItem } 	from 'material-ui/List';
import Subheader 			from 'material-ui/Subheader';
import Divider 				from 'material-ui/Divider';
import Avatar 				from 'material-ui/Avatar';
import Paper 				from 'material-ui/Paper';
import TextField 			from 'material-ui/TextField';
import ContentAdd 			from 'material-ui/svg-icons/content/add';
import IconButton 			from 'material-ui/IconButton';
import SVGLeft 					from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import SVGRight 				from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { 
	last, 
	first
} 	from 'lodash';
import {
	BottomNavigation,
	BottomNavigationItem,
} 							from 'material-ui/BottomNavigation';
import Multiplechoicecard 	from 'client/components/cards/multiplechoice';
import AppBar 				from 'material-ui/AppBar';

// local
import { IState }  			from 'client/state';

// types
import { 
	ICollection,
	ICard
} 							from 'lib/types';

// selectors
import {
	select_card
}							from 'client/state/cards/selectors';
import {
	select_collection_by_id
}							from 'client/state/collections/selectors';
import {
	select_data
} 							from 'client/state/data/selectors';
// actions
import {
	get_collection
}							from 'client/state/collections/actions';
import {
	create_data,
	update_data,
	get_data
} 							from 'client/state/data/actions';

interface IStateProps {
	collection: ICollection;
	collection_id: string;
	card: ICard;
	data;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
	search_text?: string;
}

export class UserCollectionCard extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	componentWillReceiveProps(nextProps: IProps) {
		if (this.props.card._id !== nextProps.card._id) {
			this.props.dispatch( get_data({ 
				collection_id: nextProps.collection_id,
				card_id: nextProps.card._id
			}) );
		} 
	}

	componentWillMount() {
		this.props.dispatch( get_data({ 
			collection_id: this.props.collection_id,
			card_id: this.props.card._id
		}) );
	}

	public render() {
		return (
			<div>
				<AppBar
					style={{ background: 'linear-gradient(120deg, #3498db, #1abc9c)' }}
					showMenuIconButton={true}
					title={this.props.card.name}
					iconElementLeft={<IconButton><SVGLeft /></IconButton>}
					onLeftIconButtonTouchTap={() => 
						this.props.dispatch( push('/user/collections/' + this.props.collection_id + '/cards')
						)}
				/>
				<Multiplechoicecard 
					text={this.props.card.text}
					items={this.props.card.items}
					selected_items={this.props.data.items || []}
					cb={(items, score) => {
						this.props.dispatch( 
							this.props.data
							?
							update_data(assign({}, this.props.data, {
								items,
								score
							}))
							:
							create_data({
								items,
								score,
								card_id: this.props.card._id,
								collection_id: this.props.collection_id
							})	
						);
					}}
				/>
				<BottomNavigation style={{ position: 'fixed', bottom: '0px', left: '0px', right: '0px', zIndex: 501 }}>
						<BottomNavigationItem 
							style={{
								display: first(this.props.collection.cards) !== this.props.card._id ? 'block' : 'none'
							}} 
							onClick={() => this.props.dispatch( 
								push('/user/collections/' + this.props.collection._id + '/cards/' + 
								prev(this.props.collection.cards, this.props.card._id))
							)}
							icon={<SVGLeft />} 
						/>

						<BottomNavigationItem 
							style={{display: 
								last(this.props.collection.cards) !== this.props.card._id
								? 
								'block' : 'none'
							}} 
							onClick={() => this.props.dispatch( 
								push('/user/collections/' + this.props.collection._id + '/cards/' + 
								next(this.props.collection.cards, this.props.card._id))
							)}
							icon={<SVGRight />} 
						/>
					</BottomNavigation>
			</div>
		);
	}
}

function mapStateToProps(state: IState, ownProps): IStateProps {
	return {
		collection: select_collection_by_id(state, ownProps.params.collection_id),
		collection_id: ownProps.params.collection_id,
		card: select_card(state, ownProps.params.card_id ),
		data: select_data(state, ownProps.params.collection_id, ownProps.params.card_id)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch: (action) => dispatch( action )
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(UserCollectionCard);

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