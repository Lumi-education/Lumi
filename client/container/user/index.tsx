import * as React 			from 'react';
import { connect } 			from 'react-redux';

import * as shortid 		from 'shortid';
import { IState } 			from 'client/state';

// components 
import AppBar 				from 'material-ui/AppBar';
import LeftDrawer 			from './left-drawer';

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
	request: {};
	location;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class Root extends React.Component<IProps, IComponentState> {

	constructor(props: IProps) {
		super(props);
	}

	componentWillMount() {
		this.props.dispatch( get_user_collections( ) );
	}

	public render() {
			return (
			<div id="root" >
				<AppBar
					style={{ position: 'fixed', background: 'linear-gradient(120deg, #3498db, #1abc9c)' }}
					showMenuIconButton={true}
					onLeftIconButtonTouchTap={() => this.props.dispatch( left_drawer_open() )}
				/>
				<LeftDrawer />
				<div style={{ paddingTop: '64px', paddingBottom: '40px' }}>
				{
					this.props.children 
				}
				</div>
			</div>
			);

	}
}
function mapStateToProps(state: IState, ownProps): IStateProps {
	return {
		request: state.request,
		location: ownProps.location
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
)(Root);
