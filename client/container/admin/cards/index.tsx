// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';
import { push } 			from 'react-router-redux';
import * as markdownit 		from 'markdown-it';

import { Map } 				from 'immutable';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Chip 				from 'material-ui/Chip';

import FlatButton 			from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import { List, ListItem } 	from 'material-ui/List';
import Subheader 			from 'material-ui/Subheader';
import Divider 				from 'material-ui/Divider';
import Avatar 				from 'material-ui/Avatar';
import { pinkA200, transparent } from 'material-ui/styles/colors';
import Paper 				from 'material-ui/Paper';
import TextField 			from 'material-ui/TextField';
import IconButton 			from 'material-ui/IconButton';
import SVGContentCreate		from 'material-ui/svg-icons/content/create';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import Tag 					from 'client/components/tag';
import FilterBar 			from 'client/components/filter-bar';

// local
import { IState }  			from 'client/state';

// types
import { 
	ICard,
	ITag
} 							from 'lib/types';

// selectors
import {
	select_all_cards
}							from 'client/state/cards/selectors';
import {
	select_tags_as_map
}							from 'client/state/tags/selectors';

// actions
import {
	get_cards
}							from 'client/state/cards/actions';
import {
	get_tags
}							from 'client/state/tags/actions';

const md = markdownit();

interface IStateProps {
	cards: Array<ICard>;
	tags: Map<string, ITag>;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
	filter?: Array<string>;
	search_text?: string;
	new_tag_name?: string;
	new_tag_description?: string;
}

export class AdminCards extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			filter: [],
			search_text: '',
			new_tag_name: '',
			new_tag_description: ''
		};

		// this.create_tag = this.create_tag.bind( this );
	}

	componentWillMount() {
		this.props.dispatch( get_cards() );
		this.props.dispatch( get_tags() );
	}

	// create_tag() {
	// 	if (this.state.new_tag_name !== '') {
	// 		this.props.dispatch( create_tag(this.state.new_tag_name, this.state.new_tag_description ) );
	// 		this.setState({ new_tag_name: '', new_tag_description: ''});
	// 	}

	// }

	public render() {
		return (
			<div>
				<FilterBar filter={this.state.search_text} set_filter={(filter) => this.setState({ search_text: filter})} />
				{
					this.props.cards
					.filter(card => { 
						return this.state.search_text === '' 
						? 
						true 
						: 
						(card.name + card.description).toLocaleLowerCase().indexOf( this.state.search_text.toLocaleLowerCase() ) > -1; 
					})
					// .filter(user => this.state.filter.length > 0 ? (this.state.filter.indexOf( user.name ) > -1) : true )
					.map(card => 
						<Card>
						<CardHeader
							title={card.name}
							subtitle={card.description}
							avatar={<Avatar>{
								(() => {
									switch (card.card_type) {
										case 'multiplechoice':
											return 'MC';
										case 'freetext':
											return 'FT';
										case 'sort':
											return 'S';
										default:
											return 'C';
									}
								})()
							}</Avatar>}
							actAsExpander={true}
							showExpandableButton={true}
						/>
						<CardText style={{ display: 'flex', flexWrap: 'wrap'}}>
							{card.tags.map(tag_id => <Tag tags={this.props.tags} tag_id={tag_id} />)}
						</CardText>
						<CardText expandable={true}>
							<div dangerouslySetInnerHTML={{ __html: md.render(card.text || '# ERROR \n No markdown!' )}} />
						</CardText>
						<CardActions>
							<FlatButton onClick={() => this.props.dispatch( push('/admin/cards/' + card._id) )} label="Edit" />
						</CardActions>
					</Card>
					)
				}
			</div>
		);
	}
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
	return {
		cards: select_all_cards( state ),
		tags: select_tags_as_map( state )
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
)(AdminCards);

const iconButtonElement = (
	<IconButton
		touch={true}
		tooltip="more"
		tooltipPosition="bottom-left"
	>
		<MoreVertIcon color={grey400} />
	</IconButton>
);

function rightIconMenu(menuItems) {
	return (
		<IconMenu iconButtonElement={iconButtonElement}>
			{menuItems}
		</IconMenu>
	);
}