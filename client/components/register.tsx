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
	register: (username: string, password: string) => void;
	request: 'pending' | 'success' | 'error';
	response: number;
}

interface Props extends StateProps, DispatchProps {}

interface State {
	password?: string;
	password_repeat?: string;
	username?: string;
}

export default class AuthLogin extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			password: '',
			password_repeat: '',
			username: ''
		};

		this.handle_password_input = this.handle_password_input.bind(this);
		this.handle_username_input = this.handle_username_input.bind(this);
		this.handle_password_repeat_input = this.handle_password_repeat_input.bind(this);
	}

	public handle_password_input(e) {
		this.setState({ password: e.target.value });
	}

	public handle_password_repeat_input(e) {
		this.setState({ password_repeat: e.target.value });
	}

	public handle_username_input(e, t) {
		const username = t.toLocaleLowerCase();
		this.setState({ username });
	}

	public render() {

	return (
			<div>
				<div className="app-content" style={{ paddingTop: '5px', height: '100vh' }}>
					<Paper style={{ padding: '20px', margin: '10px' }} zDepth={1}>
						<h1>Registrierung</h1>
						<TextField
								fullWidth={true}
								hintText="Benutzername"
								type="text"
								errorText={this.props.response === 409 ? 'Benutzername bereits vorhanden.' : null}
								value={this.state.username}
								onChange={this.handle_username_input}
						/>
						<TextField
								fullWidth={true}
								hintText="Passwort"
								floatingLabelText="Passwort"
								errorText={this.props.response === 401 ? 'Password falsch.' : null}
								type="password"
								value={this.state.password}
								onChange={this.handle_password_input}
						/>
						<TextField
								fullWidth={true}
								hintText="Passwort wiederholen"
								floatingLabelText="Passwort wiederholen"
								errorText={this.state.password !== this.state.password_repeat ? 'Password nicht identisch.' : null}
								type="password"
								value={this.state.password_repeat}
								onChange={this.handle_password_repeat_input}
						/>
						<RaisedButton
							fullWidth={true}
							disabled={this.state.username === '' || this.state.password !== this.state.password_repeat}
							label={this.props.request === 'pending' ? 'Lade..' : 'Registrieren'}
							buttonStyle={{ backgroundColor: state_color(this.props.request) }}
							onClick={() => { this.props.register(this.state.username, this.state.password); }}
							style={{ marginTop: '20px' }} 
						/>
					</Paper>
			</div>
			<Snackbar
				open={this.props.response >= 500}
				message={'Fehler: ' + this.props.response}
				autoHideDuration={60000}
			/>
		</div>
	);

	}
}
