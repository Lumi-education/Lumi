import * as React from 'react';

import { Redirect, Route, IndexRoute, Router } from 'react-router';

import Auth from 'client/modules/auth';
import Websocket from 'client/modules/websocket';
import Landing from 'client/modules/landing';
import AdminIndex from 'client/modules/admin';
import {
    CollectionsPage,
    AdminCollectionPage
} from 'client/modules/admin/collections';
import {
    Group,
    Groups,
    CreateOrAddUserDialog,
    AddCollectionDialog
} from 'client/modules/admin/groups';
import { TagsPage } from 'client/modules/admin/tags';
import { CardPage, CardsPage } from 'client/modules/admin/cards';
import { User, Users } from 'client/modules/admin/users';
import { Progress } from 'client/modules/admin/analytics';

import UserIndex from 'client/modules/user';
import UserCollections from 'client/modules/user/collections';
import UserCollectionCardsList from 'client/modules/user/collections/cards/list';
import UserCardPage from 'client/modules/user/collections/cards/card-page';
import UserDashboard from 'client/modules/user/dashboard';

interface IProps {
    history: {};
}

export default class RouterWrapper extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Router history={this.props.history}>
                <Route component={Auth}>
                    <Route component={Websocket}>
                        <Route path="/" component={Landing} />
                        <Route path="/user" component={UserIndex}>
                            <IndexRoute component={UserDashboard} />
                            <Route
                                path="collections/:collection_id"
                                component={UserCollections}
                            >
                                <Route
                                    path="cards"
                                    component={UserCollectionCardsList}
                                />
                                <Route
                                    path="cards/:card_id"
                                    component={UserCardPage}
                                />
                            </Route>
                        </Route>
                        <Route path="/admin" component={AdminIndex}>
                            <Route
                                path="collections"
                                component={CollectionsPage}
                            />
                            <Redirect
                                from="collections/:collection_id"
                                to="collections/:collection_id/settings"
                            />
                            <Route
                                path="collections/:collection_id/:tab"
                                component={AdminCollectionPage}
                            />
                            <Route path="groups" component={Groups} />
                            <Redirect
                                from="groups/:group_id"
                                to="groups/:group_id/users"
                            />
                            <Route
                                path="groups/:group_id/:tab"
                                component={Group}
                            />
                            <Route
                                path="groups/:group_id/users/add"
                                component={CreateOrAddUserDialog}
                            />
                            <Route
                                path="groups/:group_id/collections/add"
                                component={AddCollectionDialog}
                            />
                            <Route
                                path="analytics/progress"
                                component={Progress}
                            />
                            <Route path="users" component={Users} />
                            <Route path="users/:user_id" component={User} />
                            <Route path="tags" component={TagsPage} />
                            <Route path="cards" component={CardsPage} />
                            <Route path="cards/:card_id" component={CardPage} />
                        </Route>
                    </Route>
                </Route>
            </Router>
        );
    }
}
