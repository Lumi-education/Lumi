import * as React from 'react';

import { Redirect, Route } from 'react-router';

import AdminIndex from 'client/pages/admin';

import Group from 'client/pages/admin/groups/group';
import Groups from 'client/pages/admin/groups/groups';

import TagsPage from 'client/pages/admin/tags/tags-page';
import TagPage from 'client/pages/admin/tags/tag';
import CardPage from 'client/pages/admin/cards/card-page';
import CardsPage from 'client/pages/admin/cards/cards-page';

import UserPage from 'client/pages/admin/users/user-page';
import UsersPage from 'client/pages/admin/users/users-page';

const routes = (
    <Route path="admin" component={AdminIndex}>
        <Route path="groups" component={Groups} />
        <Redirect from="groups/:group_id" to="groups/:group_id/users" />
        <Route path="groups/:group_id/:tab" component={Group} />
        <Route path="users" component={UsersPage} />
        <Route path="users/:user_id/:tab" component={UserPage} />
        <Redirect from="users/:user_id" to="users/:user_id/settings" />
        <Route path="tags" component={TagsPage} />
        <Route path="tags/:tag_id/:tab" component={TagPage} />
        <Redirect from="tags/:tag_id" to="tags/:tag_id/settings" />
        <Route path="cards" component={CardsPage} />
        <Route path="cards/:card_id" component={CardPage} />
    </Route>
);

export default routes;
