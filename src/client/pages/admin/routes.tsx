import * as React from 'react';

import { Redirect, Route } from 'react-router';

import AdminIndex from 'client/pages/admin';
import {
    CollectionsPage,
    AdminCollectionPage
} from 'client/pages/admin/collections';

import AssignmentsPage from './analytics/assignments';
import Monitor from './analytics/monitor';

import {
    Group,
    Groups,
    CreateOrAddUserDialog
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
        <Route path="analytics/progress" component={Progress} />
        <Route path="analytics/assignments" component={AssignmentsPage} />
        <Route path="analytics/monitor" component={Monitor} />
        <Route path="users" component={Users} />
        <Route path="users/:user_id/:tab" component={User} />
        <Redirect from="users/:user_id" to="users/:user_id/settings" />
        <Route path="tags" component={TagsPage} />
        <Route path="cards" component={CardsPage} />
        <Route path="cards/:card_id" component={CardPage} />
    </Route>
);

export default routes;
