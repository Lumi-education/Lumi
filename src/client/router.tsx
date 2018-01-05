import * as React from 'react';

import { Redirect, Route, IndexRoute, Router } from 'react-router';

import Auth from 'client/modules/auth';
import Websocket from 'client/modules/websocket';
import Landing from 'client/modules/landing';

import adminRoutes from 'client/modules/admin/routes';
import userRoutes from 'client/modules/user/routes';
import installRoutes from 'client/modules/install/routes';
import dbRoute from 'client/modules/db-route';
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
