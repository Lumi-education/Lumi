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

import FilterBar 			from 'client/components/filter-bar';

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
// actions
import {
	get_collection
}							from 'client/state/collections/actions';

interface IStateProps {
	collection: ICollection;
	collection_id: string;
	cards: Array<ICard>;
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
	}

	componentWillReceiveProps(nextProps: IProps) {
		if (this.props.collection_id !== nextProps.collection_id) {
			this.props.dispatch( get_collection( nextProps.collection_id ) );
		} 
	}

	public render() {
		return (
			<div>
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
							/>
							<Divider inset={true} />
						</div>
					)
				}
				</List>
			</div>
		);
	}
}

function mapStateToProps(state: IState, ownProps): IStateProps {
	return {
		collection: select_collection_by_id(state, ownProps.params.collection_id),
		collection_id: ownProps.params.collection_id,
		cards: select_cards_by_ids(state, select_collection_by_id(state, ownProps.params.collection_id).cards )
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
