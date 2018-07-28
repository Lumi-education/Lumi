import * as React from 'react';

import {Route, IndexRoute} from 'react-router';

import UserIndex from 'client/pages/user';
import UserCollectionsRedirect from 'client/pages/user/collections/redirect';

import UserCardPage from 'client/pages/user/collections/card-page';
import UserDashboard from 'client/pages/user/dashboard';
import SubmittedAssignments from './submitted-assignments';
import CollectionSummary from './collections/summary';
import CollectionFetch from './collections/fetch';
import Grades from './grades';
import Flow from './flow';
import Card from './card';

export default (
    <Route path="user" component={UserIndex}>
        <IndexRoute component={UserDashboard} />
        <Route path="flow" component={Flow} />
        <Route path="course/:course_id/flow/:assignment_id" component={Card} />
        <Route path="grades" component={Grades} />
        <Route path="submitted-assignments" component={SubmittedAssignments} />
        <Route path="collections/:collection_id" component={CollectionFetch}>
            <IndexRoute component={UserCollectionsRedirect} />
            <Route path="cards/:card_id" component={UserCardPage} />
            <Route path="summary" component={CollectionSummary} />
        </Route>
    </Route>
);
