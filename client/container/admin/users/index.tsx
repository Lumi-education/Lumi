// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';

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
import FilterBar 			from 'client/components/filter-bar';
import ContentAdd from 'material-ui/svg-icons/content/add';

import CreateUserDialog 	from './create_user_dialog';

// local
import { IState }  			from 'client/state';

// types
import { 
	IUser,
	IGroup
} 							from 'lib/types';

// actions
import { 
	create_user,
	get_users,
	delete_user
} 							from 'client/state/users/actions';

interface IStateProps {
	users: Array<IUser>;
	groups: Array<IGroup>;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
	filter?: Array<string>;
	show_create_user_dialog?: boolean;
}

export class AdminUsers extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			filter: [],
			show_create_user_dialog: false
		};
	}

	componentWillMount() {
		this.props.dispatch( get_users() );
	}

	public render() {
		return (
			<div>
				<FilterBar filter={this.state.filter} set_filter={(filter) => this.setState({ filter })} />
				{
					this.props.users
					.filter(user => this.state.filter.length > 0 ? (this.state.filter.indexOf( user.name ) > -1) : true )
					.map(user => 
						<Card style={{ margin: '10px' }}>
							<CardHeader
								title={user.name}
								avatar="images/ok-128.jpg"
								actAsExpander={true}
								showExpandableButton={true}
							/>
							<CardText>
								<div 
									style={{
										display: 'flex',
										flexWrap: 'wrap'
										}}
								>
									{user.groups.map(group_id => <Chip>{this.props.groups.filter(g => g._id === group_id)[0].name}</Chip>)}
								</div>
							</CardText>
							<CardActions>
								<FlatButton primary={true}label="Edit" />
								<FlatButton 
									onClick={() => this.props.dispatch( delete_user( user._id ))}
									secondary={true} 
									label="Delete" 
								/>
							</CardActions>
							<CardText expandable={true}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
								Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
								Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
							</CardText>
						</Card>
					)
				}

				<FloatingActionButton 
					onClick={() => this.setState({ show_create_user_dialog: true })}
					style={{ margin: '20px', bottom: '0px', right: '20px', position: 'fixed' }}
				>
					<ContentAdd />
				</FloatingActionButton>

				{ 
					this.state.show_create_user_dialog
					? 
					<CreateUserDialog 
						create_user={(user: IUser) => this.props.dispatch( create_user( user ))}
						close={() => this.setState({ show_create_user_dialog: false })}
					/>
					: 
					null
				}
			</div>
		);
	}
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
	return {
		users: state.users.list,
		groups: state.groups.list
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
)(AdminUsers);
