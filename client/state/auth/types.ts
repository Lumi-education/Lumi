export interface Auth {
	is_authed: boolean;
	response: {
		status: number;
	};
}

export interface State {
	auth: Auth;
}
