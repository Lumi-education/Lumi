import * as React 					from 'react';

import {
	Redirect,
	Route,
	Router,
} 									from 'react-router';

import Auth 						from 'client/container/auth';
import Landing 						from 'client/container/landing';
import AdminIndex 					from 'client/container/admin';
import AdminCollections 			from 'client/container/admin/collections';
import AdminGroups 					from 'client/container/admin/groups';
import AdminGroup					from 'client/container/admin/groups/group/group_index';
import AdminGroupCreateOrAddUser	from 'client/container/admin/groups/group/create_or_add_user_dialog';
import AdminAddCollectionToGroup	from 'client/container/admin/groups/group/add_collection_dialog';
import AdminTags 					from 'client/container/admin/tags';
import AdminCards 					from 'client/container/admin/cards';
import AdminCard 					from 'client/container/admin/cards/card';
import AdminUsers 					from 'client/container/admin/users';
import AdminUser 					from 'client/container/admin/users/user';

import UserIndex 					from 'client/container/user';
import UserCollections				from 'client/container/user/collections';
import UserCollectionCardsList 		from 'client/container/user/collections/cards/list';
import UserCollectionCard 			from 'client/container/user/collections/cards/card';

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
					<Route path="/user" component={UserIndex}>
						<Route path="collections/:collection_id" component={UserCollections}>
							<Route path="cards" component={UserCollectionCardsList} />
							<Route path="cards/:card_id" component={UserCollectionCard} />
						</Route>
					</Route>
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
						<Route path="cards" component={AdminCards} />
						<Route path="cards/:card_id" component={AdminCard} />
					</Route>
				</Route>

			</Router>
			);
	}
}
