import * as React from 'react';

import { Route, IndexRoute } from 'react-router';

import UserIndex from 'client/pages/user';

import UserDashboard from 'client/pages/user/dashboard';
import Grades from './grades';
import Flow from './flow';
import Assignment from './assignment';

export default (
    <Route path="user" component={UserIndex}>
        <IndexRoute component={Flow} />
        <Route path="flow" component={Flow} />
        <Route path="assignment/:assignment_id" component={Assignment} />
        <Route path="grades" component={Grades} />
    </Route>
);
