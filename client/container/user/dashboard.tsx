import * as React 			from 'react';
import { connect } 			from 'react-redux';

import * as shortid 		from 'shortid';
import { IState } 			from 'client/state';

import {
	ICollection
}							from 'lib/types';

import { List, ListItem } 	from 'material-ui/List';
import Paper 				from 'material-ui/Paper';

// components 
import AppBar 				from 'material-ui/AppBar';
import LeftDrawer 			from './left-drawer';

// selectors
import {
	select_collections_as_array
}							from 'client/state/collections/selectors';

// actions
import {
	left_drawer_close,
	left_drawer_open,
	push
} from 'client/state/ui/actions';

import {
	init
} 	from 'client/state/user/actions';

import {
	session_update
}	from 'client/state/session/actions';

import {
	get_user_collections
} 							from 'client/state/collections/actions';

interface IStateProps {
	collections: Array<ICollection>;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class UserDashboard extends React.Component<IProps, IComponentState> {

	constructor(props: IProps) {
		super(props);
	}

	componentWillMount() {
		this.props.dispatch( get_user_collections( ) );
	}

	public render() {
			return (
			<div id="dashboard" >
				<AppBar
					style={{ background: 'linear-gradient(120deg, #3498db, #1abc9c)' }}
					showMenuIconButton={true}
					onLeftIconButtonTouchTap={() => this.props.dispatch( left_drawer_open() )}
				/>
				<Paper>
					<List>
						{
							this.props.collections.map(collection =>
								<ListItem 
									primaryText={collection.name} 
									secondaryText={collection.description}
									onClick={() => this.props.dispatch( push('/user/collections/' + collection._id + '/cards'))}
								/>
							)
						}
					</List>
				</Paper>
			</div>
			);

	}
}
function mapStateToProps(state: IState, ownProps): IStateProps {
	return {
		collections: select_collections_as_array( state )
	};
}

function mapDispatchToProps(dispatch): IDispatchProps {
	return {
		dispatch: (action) => dispatch(action)
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(UserDashboard);
