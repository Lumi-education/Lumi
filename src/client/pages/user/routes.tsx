import * as React from 'react';

import { Route, IndexRoute } from 'react-router-dom';

import UserIndex from 'client/pages/user';

import Flow from './flow';
import Assignment from './assignment';
import Comments from './comments';
import Cards from './cards';

export default (
    <Route path="user" component={UserIndex}>
        <IndexRoute component={Flow} />
        <Route path="flow" component={Flow} />
        <Route path="assignment/:assignment_id" component={Assignment} />
        <Route path="assignment/:ref_id/comments" component={Comments} />
        <Route path="comments/:ref_id" component={Comments} />
        <Route path="cards/:card_id" component={Cards} />
    </Route>
);
