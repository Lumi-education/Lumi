import * as React from 'react';

import { Redirect, Route, IndexRoute, Router } from 'react-router';

import Auth from 'client/container/auth';
import Websocket from 'client/container/websocket';
import Landing from 'client/container/landing';
import AdminIndex from 'client/container/admin';
import { Collections } from 'client/container/admin/collections';
import {
    Group,
    Groups,
    CreateOrAddUserDialog,
    AddCollectionDialog
} from 'client/container/admin/groups';
import { Tags } from 'client/container/admin/tags';
import { Card, Cards } from 'client/container/admin/cards';
import { User, Users } from 'client/container/admin/users';
import { Progress } from 'client/container/admin/analytics';

import UserIndex from 'client/container/user';
import UserCollections from 'client/container/user/collections';
import UserCollectionCardsList from 'client/container/user/collections/cards/list';
import UserCollectionCard from 'client/container/user/collections/cards/card';
import UserDashboard from 'client/container/user/dashboard';

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
                                    component={UserCollectionCard}
                                />
                            </Route>
                        </Route>
                        <Route path="/admin" component={AdminIndex}>
                            <Route path="collections" component={Collections} />
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
                            <Route path="tags" component={Tags} />
                            <Route path="cards" component={Cards} />
                            <Route path="cards/:card_id" component={Card} />
                        </Route>
                    </Route>
                </Route>
            </Router>
        );
    }
}
