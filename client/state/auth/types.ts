export interface Auth {
	is_authed: boolean;
	response: number;
}

export interface State {
	auth: Auth;
}
