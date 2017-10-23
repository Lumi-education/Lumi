import * as React 					from 'react';

import {
	Redirect,
	Route,
	Router,
} 									from 'react-router';

import Auth 						from 'client/container/auth';
import Landing 						from 'client/container/landing';
import UserIndex 					from 'client/container/user';
import AdminIndex 					from 'client/container/admin';
import AdminCollections 			from 'client/container/admin/collections';
import AdminGroups 					from 'client/container/admin/groups';
import AdminUsers 					from 'client/container/admin/users';
import AdminUser 					from 'client/container/admin/users/user';

// import Material 					from 'client/container/material';
// import Root 						from 'client/container/root';
// import MaterialMeta 				from 'client/container/material_meta';
// import CollectionMeta 				from 'client/container/collection_meta';
// import Worksheet 					from 'client/container/worksheet';

interface IProps {
	history: {};
}

interface IState {
}

export default class RouterWrapper extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	public render() {
		return(
			<Router history={this.props.history}>

				<Route component={Auth}>
					<Route path="/" component={Landing} />
					<Route path="/user" component={UserIndex} />
					<Route path="/admin" component={AdminIndex}>
						<Route path="collections" component={AdminCollections} />
						<Route path="groups" component={AdminGroups} />
						<Route path="users" component={AdminUsers} />
						<Route path="users/:user_id" component={AdminUser} />
					</Route>
				</Route>

			</Router>
			);
	}
}
