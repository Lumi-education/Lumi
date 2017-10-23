// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';

import TextField 			from 'material-ui/TextField';
import Divider 				from 'material-ui/Divider';
import Paper 				from 'material-ui/Paper';

// local
import { IState }  			from 'client/state';

// types
import { 
	IUser,
	IGroup
} 							from 'lib/types';

// actions
import {
	get_user 
}							from 'client/state/users/actions';

interface IStateProps {
	user: IUser;
	user_id: string;
}

interface IDispatchProps {
	dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminUsers extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	componentWillMount() {
		this.props.dispatch( get_user( this.props.user_id) );
	}

	public render() {
		if (this.props.user) {
			return (
				<div>
					<Paper>
						<TextField 
							hintText="Name" 
							floatingLabelText="Name" 
							value={this.props.user.name}
							fullWidth={true}
							underlineShow={false} 
						/>
					</Paper>
				</div>
			);
		} else {
			return <div>loading</div>;
		}
		
	}
}

function mapStateToProps(state: IState, ownProps): IStateProps {
	return {
		user: state.users.list.filter(u => u._id === ownProps.params.user_id)[0],
		user_id: ownProps.params.user_id
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch: (action) => dispatch( action )
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(AdminUsers);
