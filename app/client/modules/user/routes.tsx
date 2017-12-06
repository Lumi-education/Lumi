import * as React from 'react';

import { Route, IndexRoute } from 'react-router';

import UserIndex from 'client/modules/user';
import UserCollections from 'client/modules/user/collections';
import UserCollectionCardsList from 'client/modules/user/collections/cards/list';
import UserCardPage from 'client/modules/user/collections/cards/card-page';
import UserDashboard from 'client/modules/user/dashboard';

export default (
    <Route path="/user" component={UserIndex}>
        <IndexRoute component={UserDashboard} />
        <Route path="collections/:collection_id" component={UserCollections}>
            <Route path="cards" component={UserCollectionCardsList} />
            <Route path="cards/:card_id" component={UserCardPage} />
        </Route>
    </Route>
);
