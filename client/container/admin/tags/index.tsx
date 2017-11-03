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
import { pinkA200, transparent } from 'material-ui/styles/colors';
import Paper 				from 'material-ui/Paper';
import TextField 			from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';

import FilterBar 			from 'client/components/filter-bar';

// local
import { IState }  			from 'client/state';

// types
import { 
	ITag
} 							from 'lib/types';

// selectors
import {
	select_all_tags
}							from 'client/state/tags/selectors';

// actions
import {
	get_tags
}							from 'client/state/tags/actions';

interface IStateProps {
	tags: Array<ITag>;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
	filter?: Array<string>;
	search_text?: string;
	show_create_user_dialog?: boolean;
}

export class AdminTags extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			filter: [],
			search_text: '',
			show_create_user_dialog: false
		};
	}

	componentWillMount() {
		this.props.dispatch( get_tags() );
	}

	public render() {
		return (
			<div>
				<FilterBar filter={this.state.search_text} set_filter={(filter) => this.setState({ search_text: filter})} />
				<List>
				{
					this.props.tags
					.filter(tag => { 
						return this.state.search_text === '' 
						? 
						true 
						: 
						tag.name.toLocaleLowerCase().indexOf( this.state.search_text.toLocaleLowerCase() ) > -1; 
					})
					// .filter(user => this.state.filter.length > 0 ? (this.state.filter.indexOf( user.name ) > -1) : true )
					.map(tag => 
						<div>
							<ListItem 
								leftAvatar={<Avatar>{tag.name.substring(0, 3)}</Avatar>}
								primaryText={tag.name} 
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

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
	return {
		tags: select_all_tags( state )
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
)(AdminTags);
