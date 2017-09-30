import * as React 			from 'react';
import { connect } 			from 'react-redux';
import { push } 			from 'react-router-redux';
import { Dispatch } 		from 'redux';

import { State as Root_State } 			from '../state';

import {
	get_session,
 } 		from '../state/auth/actions';

// import Login 						from 'lib/auth/components/login';

interface StateProps {
	is_authed: boolean;
}

interface DispatchProps {
	dispatch: (action) => void;
}

interface Props extends StateProps, DispatchProps {}

interface State {}

export class Auth extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
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
			this.props.dispatch( push( '/login' ) );
			return (<div id="auth">not authed</div>);
		}
			
	}
}
function mapStateToProps(state: Root_State, ownProps: {}): StateProps {
    return {
		is_authed: state.auth.is_authed
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
