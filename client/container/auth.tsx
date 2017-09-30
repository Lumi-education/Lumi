import * as React 			from 'react';
import { connect } 			from 'react-redux';
import { push } 			from 'react-router-redux';
import { Dispatch } 		from 'redux';

import * as shortid 		from 'shortid';

import { State as Root_State } 			from '../state';

import {
	get_session,
	login
 } 		from '../state/auth/actions';

import Login 						from '../components/login';

interface StateProps {
	is_authed: boolean;
	response: { status: number; };
	request: {};
}

interface DispatchProps {
	dispatch: (action) => void;
}

interface Props extends StateProps, DispatchProps {}

interface State {}

export class Auth extends React.Component<Props, State> {

	public request_id: string;
	
	constructor(props: Props) {
		super(props);

		this.login = this.login.bind(this);
	}

	public login(username: string, password: string) {
		this.request_id = shortid();
		this.props.dispatch( login(username, password, this.request_id) );
	}

	public componentWillMount() {
		this.props.dispatch( get_session() );
	}

	public render() {
		if (this.props.is_authed) {
			return (
				<div id="auth">{this.props.children}</div>
			);
		} else {
			return (
				<Login 
					login={this.login} 
					request={this.props.request[this.request_id]}
					response={this.props.response}
				/>
			);
		}
			
	}
}
function mapStateToProps(state: Root_State, ownProps: {}): StateProps {
    return {
		is_authed: state.auth.is_authed,
		response: state.auth.response,
		request: state.request
	};
}

function mapDispatchToProps(dispatch: Dispatch<{}>): DispatchProps {
  return {
	  dispatch: (action) => dispatch(action)
  };
}

export default connect<{}, {}, {}>(
  mapStateToProps,
  mapDispatchToProps,
)(Auth);
