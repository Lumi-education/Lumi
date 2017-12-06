import * as React from 'react';

import { Redirect, Route, IndexRoute, Router } from 'react-router';

import Auth from 'client/modules/auth';
import Websocket from 'client/modules/websocket';
import Landing from 'client/modules/landing';

import adminRoutes from 'client/modules/admin/routes';
import userRoutes from 'client/modules/user/routes';

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
                        {userRoutes}
                        {adminRoutes}
                    </Route>
                </Route>
            </Router>
        );
    }
}
