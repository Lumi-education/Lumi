import * as React 					from 'react';

import {
	Redirect,
	Route,
	Router,
} 									from 'react-router';

import Auth 						from '../container/auth';
// import Init 						from '../container/init';
import Landing 						from '../container/landing';
// import Material 					from '../container/material';
import Root 						from '../container/root';

interface Props {
	history: {};
}

interface State {
}

export default class RouterWrapper extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		return(
			<Router history={this.props.history}>

					<Route component={Auth}>
								<Route component={Root}>
									<Route path="/" component={Landing} />
									{/* <Route path="material" component={Material} /> */}
								</Route>
					</Route>
					<Route path="/login" component={Landing} />
					<Redirect from="*" to="/" />
			</Router>
			);
	}
}
