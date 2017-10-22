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
	left_drawer_open
} from 'client/state/ui/actions';

import {
	init
} 	from 'client/state/user/actions';

import {
	get_collections
} 							from 'client/state/collection/actions';

interface IStateProps {
	request: {};
	location;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminRoot extends React.Component<IProps, IComponentState> {

	private init_action_id: string;

	constructor(props: IProps) {
		super(props);
	}

	componentWillMount() {
		this.init_action_id = shortid();
		this.props.dispatch( get_collections( this.init_action_id ) );
	}

	public render() {
			return (
			<div id="AdminRoot" >
				<AppBar
					style={{ position: 'fixed' }}
					showMenuIconButton={true}
					onLeftIconButtonTouchTap={() => this.props.dispatch( left_drawer_open() )}
				/>
				<LeftDrawer />
				<div style={{ paddingTop: '120px', paddingBottom: '40px' }}>
				{
					this.props.request[this.init_action_id] === 'success' 
					? 
					this.props.children 
					: 
					<div>loading init data</div>
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
)(AdminRoot);
