// modules
import * as React 			from "react";

// material-ui
import AppBar           	from "material-ui/AppBar";
import Paper 				from "material-ui/Paper";
import RaisedButton 		from "material-ui/RaisedButton";
import Snackbar 			from "material-ui/Snackbar";
import TextField 			from "material-ui/TextField";

// components

// utils
import { state_color } 		from "lib/utils";

interface IStateProps {
	ui: "init" | "password_incorrect" | "username_taken" | "username_available";
	request: "init" | "pending" | "success" | "error";
}

interface IDispatchProps {
	login_user: (name: string, password: string) => void;
	register_user: (username: string) => void;
	request_username: (username: string) => void;
	reset_request: () => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {
	password?: string;
	username?: string;
}

export default class Login extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			password: "",
			username: "",
		};

		this.handle_password_input = this.handle_password_input.bind(this);
		this.handle_username_input = this.handle_username_input.bind(this);
	}

	public componentDidMount() {}

	public handle_password_input(e) {
		this.setState({ password: e.target.value });
		if (this.props.request != "init") { this.props.reset_request(); }
	}

	public handle_username_input(e, t) {
		const username = t.toLocaleLowerCase();
		if (this.props.request != "init") { this.props.reset_request(); }
		this.props.request_username(username);
		this.setState({ username });
	}

	public render() {

	return (
			<div>
					<div className="app-content" style={{
						paddingTop: "5px",

						height: "100vh" }}>
				<Paper style={{ padding: "20px", margin: "10px" }} zDepth={3}>
					<h1>Anmeldung</h1>
					<TextField
							fullWidth
							errorText={
								(() => {
									switch (this.props.ui) {
										case "username_taken":
											return "Benutzername vergeben.";
										case "username_available":
											return "Benutzername frei.";
										default:
											return null;
									}
								})()
								}
								errorStyle={
								(() => {
									switch (this.props.ui) {
										case "username_taken":
											return { color: "#f39c12" };
										case "username_available":
											return { color: "#27ae60" };
										default:
											return { color: "#2980b9" };
									}
								})()
							}
							hintText="Benutzername"
							type="text"
							value={this.state.username}
							onChange={this.handle_username_input}
						/>
						{
							(this.props.ui == "username_taken" || this.props.ui == "password_incorrect") && this.state.username != ""
							?
							<TextField
								fullWidth
								hintText="Passwort"
								floatingLabelText="Passwort"
								errorText={this.props.ui == "password_incorrect" ? "Passwort falsch." : null}
								type="password"
								value={this.state.password}
								onChange={this.handle_password_input}
							/>
							:
							null
						}
					<RaisedButton
						fullWidth
						disabledBackgroundColor="#95a5a6"
						disabled={this.state.username == ""}
						label={this.props.request == "pending" ? "Lade" : "Anmelden"}
						onClick={() => {

								switch (this.props.ui) {
									case "username_taken":
									case "password_incorrect":
										this.props.login_user(this.state.username.toLocaleLowerCase() , this.state.password);
									 break;
									case "username_available":
										this.props.register_user(this.state.username.toLocaleLowerCase());
									 break;
								}
						}}
						buttonStyle={{
								backgroundColor: state_color(this.props.request),
							}}
						style={{
							marginTop: "20px",
							}} />
				</Paper>
				</div>
				</div>
	);

	}
}
