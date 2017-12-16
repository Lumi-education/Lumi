import * as React from 'react';

import { Redirect, Route } from 'react-router';

import AdminIndex from 'client/modules/admin';
import {
    CollectionsPage,
    AdminCollectionPage
} from 'client/modules/admin/collections';

import {
    Group,
    Groups,
    CreateOrAddUserDialog,
    AddCollectionDialog
} from 'client/modules/admin/groups';

import { TagsPage } from 'client/modules/admin/tags';
import { CardPage, CardsPage } from 'client/modules/admin/cards';
import { User, Users } from 'client/modules/admin/users';
import { Progress } from 'client/modules/admin/analytics';

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
