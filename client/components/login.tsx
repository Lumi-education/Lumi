// modules
import * as React 			from 'react';

// material-ui
import AppBar           	from 'material-ui/AppBar';
import Paper 				from 'material-ui/Paper';
import RaisedButton 		from 'material-ui/RaisedButton';
import TextField 			from 'material-ui/TextField';
import Snackbar 			from 'material-ui/Snackbar';

import { state_color } 		from '../style/utils';

interface StateProps {}

interface DispatchProps {
	login: (username: string, password: string) => void;
	request: 'pending' | 'success' | 'error';
	response: { status: number; };
}

interface Props extends StateProps, DispatchProps {}

interface State {
	password?: string;
	username?: string;
}

export default class AuthLogin extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			password: '',
			username: '',
		};

		this.handle_password_input = this.handle_password_input.bind(this);
		this.handle_username_input = this.handle_username_input.bind(this);
	}

	public handle_password_input(e) {
		this.setState({ password: e.target.value });
	}

	public handle_username_input(e, t) {
		const username = t.toLocaleLowerCase();
		this.setState({ username });
	}

	public render() {

	return (
			<div>
				<div className="app-content" style={{ paddingTop: '5px', height: '100vh' }}>
					<Paper style={{ padding: '20px', margin: '10px' }} zDepth={3}>
						<h1>Anmeldung</h1>
						<TextField
								fullWidth={true}
								hintText="Benutzername"
								type="text"
								errorText={this.props.response.status === 404 ? 'Username not found.' : null}
								value={this.state.username}
								onChange={this.handle_username_input}
						/>
						<TextField
								fullWidth={true}
								hintText="Passwort"
								floatingLabelText="Passwort"
								errorText={this.props.response.status === 401 ? 'Password incorrect.' : null}
								type="password"
								value={this.state.password}
								onChange={this.handle_password_input}
						/>
						<RaisedButton
							fullWidth={true}
							disabled={this.state.username === ''}
							label={this.props.request === 'pending' ? 'Loading..' : 'Login'}
							buttonStyle={{ backgroundColor: state_color(this.props.request) }}
							onClick={() => { this.props.login(this.state.username, this.state.password); }}
							style={{ marginTop: '20px' }} 
						/>
					</Paper>
			</div>
			<Snackbar
				open={this.props.response.status >= 500}
				message={'Error: could not connect to server: ' + this.props.response.status}
				autoHideDuration={60000}
			/>
		</div>
	);

	}
}
