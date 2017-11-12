import * as React from 'react';

import { Redirect, Route, Router } from 'react-router';

import Auth from './container/auth';
import Landing from './container/landing';
import UserIndex from './container/user';
import AdminIndex from './container/admin';
import AdminCollections from './container/admin/collections';
import AdminGroups from './container/admin/groups';
import AdminGroup from './container/admin/groups/group/group_index';
import AdminGroupCreateOrAddUser from './container/admin/groups/group/create_or_add_user_dialog';
import AdminAddCollectionToGroup from './container/admin/groups/group/add_collection_dialog';
import AdminTags from './container/admin/tags';
import AdminCards from './container/admin/cards';
import AdminCard from './container/admin/cards/card';

import AdminUsers from './container/admin/users';
import AdminUser from './container/admin/users/user';

// import Material 					from './container/material';
// import Root 						from './container/root';
// import MaterialMeta 				from './container/material_meta';
// import CollectionMeta 				from './container/collection_meta';
// import Worksheet 					from './container/worksheet';

interface IProps {
  history: {};
}

interface IState {}

export default class RouterWrapper extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Router history={this.props.history}>
        <Route component={Auth}>
          <Route path="/" component={Landing} />
          <Route path="/user" component={UserIndex} />
          <Route path="/admin" component={AdminIndex}>
            <Route path="collections" component={AdminCollections} />
            <Route path="groups" component={AdminGroups} />
            <Redirect from="groups/:group_id" to="groups/:group_id/users" />
            <Route path="groups/:group_id/:tab" component={AdminGroup} />
            <Route
              path="groups/:group_id/users/add"
              component={AdminGroupCreateOrAddUser}
            />
            <Route
              path="groups/:group_id/collections/add"
              component={AdminAddCollectionToGroup}
            />
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
