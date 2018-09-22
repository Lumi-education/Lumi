import * as React from 'react';

import { Route, IndexRoute } from 'react-router';

import UserIndex from 'client/pages/user';

import Grades from './grades';
import Flow from './flow';
import Assignment from './assignment';
import Comments from './comments';

export default (
    <Route path="user" component={UserIndex}>
        <IndexRoute component={Flow} />
        <Route path="flow" component={Flow} />
        <Route path="assignment/:assignment_id" component={Assignment} />
        <Route path="assignment/:ref_id/comments" component={Comments} />
        <Route path="comments/:ref_id" component={Comments} />
        <Route path="grades" component={Grades} />
    </Route>
);
