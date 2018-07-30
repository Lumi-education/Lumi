import * as React from 'react';

import {Redirect, Route} from 'react-router';

import AdminIndex from 'client/pages/admin';

import {Group, Groups, CreateOrAddUserDialog} from 'client/pages/admin/groups';

import {TagsPage} from 'client/pages/admin/tags';
import CardPage from 'client/pages/admin/cards/card-page';
import CardsPage from 'client/pages/admin/cards/cards-page';

import {User, Users} from 'client/pages/admin/users';

const routes = (
    <Route path="admin" component={AdminIndex}>
        <Route path="groups" component={Groups} />
        <Redirect from="groups/:group_id" to="groups/:group_id/users" />
        <Route path="groups/:group_id/:tab" component={Group} />
        <Route
            path="groups/:group_id/users/add"
            component={CreateOrAddUserDialog}
        />
        <Route path="users" component={Users} />
        <Route path="users/:user_id/:tab" component={User} />
        <Redirect from="users/:user_id" to="users/:user_id/settings" />
        <Route path="tags" component={TagsPage} />
        <Route path="cards" component={CardsPage} />
        <Route path="cards/:card_id" component={CardPage} />
    </Route>
);

export default routes;
