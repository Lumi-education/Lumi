import * as React from 'react';

import { Route, IndexRoute } from 'react-router';

import UserIndex from 'client/pages/user';
import UserCollectionsRedirect from 'client/pages/user/collections/redirect';

import UserCardPage from 'client/pages/user/collections/card-page';
import UserDashboard from 'client/pages/user/dashboard';
import UserAssignments from './assignments';
import SubmittedAssignments from './submitted-assignments';
import CollectionSummary from './collections/summary';
import CollectionFetch from './collections/fetch';
import Grades from './grades';

export default (
    <Route path="user" component={UserIndex}>
        <IndexRoute component={UserDashboard} />
        <Route path="assignments" component={UserAssignments} />
        <Route path="grades" component={Grades} />
        <Route path="submitted-assignments" component={SubmittedAssignments} />
        <Route path="collections/:collection_id" component={CollectionFetch}>
            <IndexRoute component={UserCollectionsRedirect} />
            <Route path="cards/:card_id" component={UserCardPage} />
            <Route path="summary" component={CollectionSummary} />
        </Route>
    </Route>
);
