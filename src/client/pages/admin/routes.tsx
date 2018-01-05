import * as React from 'react';

import { Redirect, Route } from 'react-router';

import AdminIndex from 'client/pages/admin';
import {
    CollectionsPage,
    AdminCollectionPage
} from 'client/pages/admin/collections';

import {
    Group,
    Groups,
    CreateOrAddUserDialog,
    AddCollectionDialog
} from 'client/pages/admin/groups';

import { TagsPage } from 'client/pages/admin/tags';
import { CardPage, CardsPage } from 'client/pages/admin/cards';
import { User, Users } from 'client/pages/admin/users';
import { Progress } from 'client/pages/admin/analytics';

const routes = (
    <Route path="admin" component={AdminIndex}>
        <Route path="collections" component={CollectionsPage} />
        <Redirect
            from="collections/:collection_id"
            to="collections/:collection_id/settings"
        />
        <Route
            path="collections/:collection_id/:tab"
            component={AdminCollectionPage}
        />
        <Route path="groups" component={Groups} />
        <Redirect from="groups/:group_id" to="groups/:group_id/users" />
        <Route path="groups/:group_id/:tab" component={Group} />
        <Route
            path="groups/:group_id/users/add"
            component={CreateOrAddUserDialog}
        />
        <Route
            path="groups/:group_id/collections/add"
            component={AddCollectionDialog}
        />
        <Route path="analytics/progress" component={Progress} />
        <Route path="users" component={Users} />
        <Route path="users/:user_id" component={User} />
        <Route path="tags" component={TagsPage} />
        <Route path="cards" component={CardsPage} />
        <Route path="cards/:card_id" component={CardPage} />
    </Route>
);

export default routes;
