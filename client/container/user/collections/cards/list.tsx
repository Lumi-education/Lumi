// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';
import { push } 			from 'react-router-redux';

import { Map } 				from 'immutable';
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
import AppBar 				from 'material-ui/AppBar';
import IconButton 			from 'material-ui/IconButton';
import SVGLeft 					from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FilterBar 			from 'client/components/filter-bar';
import SVGAssignmentReturn 	from 'material-ui/svg-icons/action/assignment-return';
import SVGCorrect			from 'material-ui/svg-icons/action/done';
import SVGWrong				from 'material-ui/svg-icons/navigation/close';

import { get_grade_color } 	from 'client/style/utils';
// local
import { IState }  			from 'client/state';

// types
import { 
	ICollection,
	ICard
} 							from 'lib/types';

// selectors
import {
	select_cards_by_ids
}							from 'client/state/cards/selectors';
import {
	select_collection_by_id
}							from 'client/state/collections/selectors';
import {
	select_data_for_collection,
	select_data_as_map
}							from 'client/state/data/selectors';
// actions
import {
	get_collection
}							from 'client/state/collections/actions';

import {
	create_data,
	update_data,
	get_data
}							from 'client/state/data/actions';

interface IStateProps {
	collection: ICollection;
	collection_id: string;
	cards: Array<ICard>;
	data;
	card_data: Map<string, any>;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
	search_text?: string;
}

export class UserCollectionsCards extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	componentWillMount() {
		this.props.dispatch( get_collection( this.props.collection_id ) );
		this.props.dispatch( get_data({ collection_id: this.props.collection_id }) );
	}

	componentWillReceiveProps(nextProps: IProps) {
		if (this.props.collection_id !== nextProps.collection_id) {
			this.props.dispatch( get_collection( nextProps.collection_id ) );
			this.props.dispatch( get_data({ collection_id: nextProps.collection_id }) );
		} 
	}

	public render() {
		return (
			<div>
				<AppBar
					style={{ background: 'linear-gradient(120deg, #3498db, #1abc9c)' }}
					showMenuIconButton={true}
					title={this.props.collection.name}
					iconElementLeft={<IconButton><SVGLeft /></IconButton>}
					onLeftIconButtonTouchTap={() => this.props.dispatch( push('/user'))}
				/>
				<Paper>
					<List>
					{
						this.props.cards
						.map((card, i) => 
							<div>
								<ListItem 
									leftAvatar={<Avatar>{i + 1}</Avatar>}
									primaryText={card.name} 
									onClick={() => 
										this.props.dispatch( push('/user/collections/' + this.props.collection._id + '/cards/' + card._id ))
									}
									rightIcon={
										this.props.data.submitted
										?
										(
											(this.props.card_data.toArray().filter(data => 
												data.collection_id === this.props.collection_id &&
												data.card_id === card._id &&
												data.data_type === 'card')[0] || {}).score > 0
											?
											<SVGCorrect />
											: 
											<SVGWrong />
										)
										:
										null
									}
								/>
								<Divider inset={true} />
							</div>
						)
					}
					</List>
				</Paper>
				<Paper style={{ marginTop: '10px' }}>
					<List>
						{
							this.props.data.submitted
							?
							(() => {
								const percent = (this.props.card_data.toArray().filter(data => 
									data.collection_id === this.props.collection_id &&
									data.data_type === 'card')
									.reduce((p, a) => p + (a.score || 0), 0) / this.props.collection.cards.length) * 100 ;

								return (
									<ListItem
										primaryText={ this.props.card_data.toArray().filter(data => 
													data.collection_id === this.props.collection_id &&
													data.data_type === 'card').reduce((p, a) => p + (a.score || 0), 0)
													+ ' von ' + this.props.collection.cards.length + ' (' + percent + '%) richtig'}
										style={{ backgroundColor: get_grade_color(percent)}}
									/>);
							})()
							
							: 
							<ListItem 
								leftIcon={<SVGAssignmentReturn />}
								primaryText="Einreichen" 
								onClick={() => {
									this.props.data._id
									?
									this.props.dispatch( update_data({
										submitted: true
									}))
									:
									this.props.dispatch( create_data({
										collection_id: this.props.collection_id,
										data_type: 'collection',
										submitted: true
									}));
								}}
							/>
						}
					</List>
				</Paper>
			</div>
		);
	}
}

function mapStateToProps(state: IState, ownProps): IStateProps {
	return {
		collection: select_collection_by_id(state, ownProps.params.collection_id),
		collection_id: ownProps.params.collection_id,
		cards: select_cards_by_ids(state, select_collection_by_id(state, ownProps.params.collection_id).cards ),
		card_data: select_data_as_map( state ),
		data: select_data_for_collection(state, ownProps.params.collection_id)
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
)(UserCollectionsCards);