import * as React from 'react';

import { Redirect, Route } from 'react-router-dom';

import AdminIndex from 'client/pages/admin';

import Group from 'client/pages/admin/groups/group';
import Groups from 'client/pages/admin/groups/groups';

import TagsPage from 'client/pages/admin/tags/tags-page';
import TagPage from 'client/pages/admin/tags/tag';
import CardPage from 'client/pages/admin/cards/card-page';
import CardsPage from 'client/pages/admin/cards/cards-page';

import UserPage from 'client/pages/admin/users/user-page';
import UsersPage from 'client/pages/admin/users/users-page';

import ActivityIndex from 'client/pages/admin/activity/activity_index';
import CommentsIndex from 'client/pages/admin/comments/comments_index';
import SystemIndex from 'client/pages/admin/system/system_index';
import Lesson from 'client/pages/admin/lessons/lesson';
import Folder from 'client/pages/admin/folders';

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
        <Route path="activity" component={ActivityIndex} />
        <Route path="comments" component={CommentsIndex} />
        <Route path="system/:tab" component={SystemIndex} />
        <Redirect from="system" to="system/update" />
        <Route path="analytics/lesson/:lesson_id" component={Lesson} />
        <Route path="folders/:folder_id" component={Folder} />
    </Route>
);

export default routes;
