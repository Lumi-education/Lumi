import * as React from 'react';

import { Route, IndexRoute } from 'react-router';

import UserIndex from 'client/pages/user';

import UserDashboard from 'client/pages/user/dashboard';
import Grades from './grades';
import Flow from './flow';
import Card from './card';

export default (
    <Route path="user" component={UserIndex}>
        <IndexRoute component={UserDashboard} />
        <Route path="flow" component={Flow} />
        <Route path="course/:course_id/flow/:assignment_id" component={Card} />
        <Route path="grades" component={Grades} />
    </Route>
);
