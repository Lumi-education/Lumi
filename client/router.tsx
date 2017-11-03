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
import AdminGroup					from 'client/container/admin/groups/group/group_index';
import AdminGroupCreateOrAddUser	from 'client/container/admin/groups/group/create_or_add_user_dialog';
import AdminAddCollectionToGroup	from 'client/container/admin/groups/group/add_collection_dialog';
import AdminTags 					from 'client/container/admin/tags';

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
						<Redirect from="groups/:group_id" to ="groups/:group_id/users" />
						<Route path="groups/:group_id/:tab" component={AdminGroup} />
						<Route path="groups/:group_id/users/add" component={AdminGroupCreateOrAddUser} />
						<Route path="groups/:group_id/collections/add" component={AdminAddCollectionToGroup} />
						<Route path="users" component={AdminUsers} />
						<Route path="users/:user_id" component={AdminUser} />
						<Route path="tags" component={AdminTags} />
					</Route>
				</Route>

			</Router>
			);
	}
}
