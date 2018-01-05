import * as React from 'react';

import { Redirect, Route, IndexRoute, Router } from 'react-router';

import Auth from 'client/pages/auth';
import Websocket from 'client/pages/websocket';
import Landing from 'client/pages/landing';

import adminRoutes from 'client/pages/admin/routes';
import userRoutes from 'client/pages/user/routes';
import installRoutes from 'client/pages/install/routes';
import dbRoute from 'client/pages/db-route';
import { CheckDBContainer } from 'lib/system';

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
                <Route path="/" component={dbRoute} />
                <Route path="/:db" component={CheckDBContainer}>
                    {installRoutes}
                    <Route component={Auth}>
                        <Route component={Websocket}>
                            <IndexRoute component={Landing} />
                            {userRoutes}
                            {adminRoutes}
                        </Route>
                    </Route>
                </Route>
            </Router>
        );
    }
}
