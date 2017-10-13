import * as React 			from 'react';
import { connect } 			from 'react-redux';

import * as shortid 		from 'shortid';
import { State as Root_State } 			from '../state';

// components 
import AppBar 				from 'material-ui/AppBar';
import LeftDrawer 			from './left-drawer';
import Load_page 			from '../components/load-page';

// actions
import {
	left_drawer_close,
	left_drawer_open,
	push
} from '../state/ui/actions';

import {
	init
} 	from '../state/user/actions';

import {
	session_update
}	from '../state/session/actions';

import {
	get_collections
} 							from '../state/collection/actions';

interface StateProps {
	request: {};
	location;
}

interface DispatchProps {
	dispatch: (action) => void;
}

interface Props extends StateProps, DispatchProps {}

interface State {}

export class Root extends React.Component<Props, State> {

	private init_action_id: string;
	constructor(props: Props) {
		super(props);
	}

	componentWillMount() {
		this.props.dispatch( get_collections() );
		this.init_action_id = shortid();
		this.props.dispatch( init(this.init_action_id) );
		this.props.dispatch( session_update({ location: this.props.location.pathname }) );
		
	}

	public render() {
			return (
			<div id="root" >
				<AppBar
					style={{ backgroundColor: '#FFFFFF', position: 'fixed'}}
					titleStyle={{ color: '#222222'}}
					showMenuIconButton={true}
					onLeftIconButtonTouchTap={() => this.props.dispatch( left_drawer_open() )}
				/>
				<LeftDrawer />
				<div style={{ paddingTop: '64px', paddingBottom: '40px' }}>
				{
					this.props.request[this.init_action_id] === 'success' 
					? 
					this.props.children 
					: 
					<Load_page><div>loading init data</div></Load_page>
				}
				</div>
			</div>
			);

	}
}
function mapStateToProps(state: Root_State, ownProps): StateProps {
	return {
		request: state.request,
		location: ownProps.location
	};
}

function mapDispatchToProps(dispatch): DispatchProps {
	return {
		dispatch: (action) => dispatch(action)
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(Root);
