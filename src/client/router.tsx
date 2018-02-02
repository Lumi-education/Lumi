import * as React from 'react';

import { Redirect, Route, IndexRoute, Router } from 'react-router';

import Auth from 'client/pages/auth';
import * as Core from 'lib/core';
import Landing from 'client/pages/landing';

import adminRoutes from 'client/pages/admin/routes';
import userRoutes from 'client/pages/user/routes';
import installRoutes from 'client/pages/install/routes';

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
                    <Route component={Core.container.websocket}>
                        <Route path="/" component={Landing} />
                        {userRoutes}
                        {adminRoutes}
                    </Route>
                </Route>
            </Router>
        );
    }
}
