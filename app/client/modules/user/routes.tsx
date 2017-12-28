import * as React from 'react';

import { Route, IndexRoute } from 'react-router';

import UserIndex from 'client/modules/user';
import UserCollections from 'client/modules/user/collections';
import UserCollectionsRedirect from 'client/modules/user/collections/redirect';

import UserCardPage from 'client/modules/user/collections/cards/card-page';
import UserDashboard from 'client/modules/user/dashboard';
import UserAssignments from './assignments';
import SubmittedAssignments from './submitted-assignments';
import CollectionSummary from './collections/summary';

export default (
    <Route path="user" component={UserIndex}>
        <IndexRoute component={UserDashboard} />
        <Route path="assignments" component={UserAssignments} />
        <Route path="submitted-assignments" component={SubmittedAssignments} />
        <Route path="collections/:collection_id" component={UserCollections}>
            <IndexRoute component={UserCollectionsRedirect} />
            <Route path="cards/:card_id" component={UserCardPage} />
            <Route path="summary" component={CollectionSummary} />
        </Route>
    </Route>
);
