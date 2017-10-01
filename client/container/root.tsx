import * as React 			from 'react';
import { connect } 			from 'react-redux';
import { push } 			from 'react-router-redux';

import * as qs 				from 'query-string';
import * as url_parse 		from 'url-parse';
import { State as Root_State } 			from '../state';

// import { Collection } 		from 'lib/collection/types';
// import { Material } 		from 'lib/material/types';
// import { session_update } 	from 'lib/session/actions';
// import { Settings } 		from 'lib/settings/types';

import * as Socket_io 	from 'socket.io-client';

// components 
import AppBar 				from 'material-ui/AppBar';
import LeftDrawer 			from './left-drawer';

// actions
import {
	left_drawer_close,
	left_drawer_open,
} from '../state/ui/actions';

import {
	get_collections
} 							from '../state/collection/actions';

interface StateProps {
	// left_drawer_show: boolean;
	// collection_list: Collection[];
	// material_list: Material[];
	// user_id: string;
	// settings: Settings;
	// location: {};
	// query: any;
}
interface DispatchProps {
	dispatch: (action) => void;
	push: (url: string) => void;
}

interface Props extends StateProps, DispatchProps {}

interface State {}

export class Root extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.push = this.push.bind(this);
	}

	// public socket: Socket_io;

	componentWillMount() {
		this.props.dispatch( get_collections() );
	}

	// public componentDidMount() {
	// 	if (this.props.settings.entry_point) {
	// 		this.props.push(this.props.settings.url);
	// 	}
	// }

	// public componentWillReceiveProps(nextProps: Props) {
	// 	if (nextProps.settings.entry_point && (nextProps.settings.url !== this.props.settings.url)) {
	// 		this.props.push(nextProps.settings.url);
	// 	}
	// }

	public push(url: string) {
		// if (!this.props.settings.controlled) {
			this.props.dispatch( push( url ) );
		// }
	}

	public render() {
			// if (this.props.settings.controlled && (this.props.location.pathname + this.props.location.search 
			// !== this.props.settings.url)) {
			// 	this.props.push(this.props.settings.url);
			// }

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
				{this.props.children}
				</div>
			</div>
			);

	}
}
function mapStateToProps(state: Root_State, ownProps: {}): StateProps {
    return {
			// collection_list: state.collection.list,
			// left_drawer_show: state.ui.left_drawer_show,
			// material_list: state.material.list,
			// user_id: state.auth.user_id,
			// settings: state.settings,
			// location: ownProps.router.location,
			// query: ownProps.location.query,
		};
}

function mapDispatchToProps(dispatch): DispatchProps {
  return {
		  push: (url: string) => {
			  dispatch( push(url) );
			//   dispatch( left_drawer_close() );
			//   dispatch( session_update({ query: qs.parse(url_parse(url).query) }) );
			},
		  dispatch: (action) => dispatch(action)
  };
}

export default connect<{}, {}, {}>(
  mapStateToProps,
  mapDispatchToProps,
)(Root);
