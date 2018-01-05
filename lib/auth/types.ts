export interface IAuth {
    is_authed: boolean;
    response: number;
    userlevel: number;
    user_id: string;
    is_required: boolean;
    username: '';
    username_request: 'init' | 'pending' | 'success' | 'error';
    login_request: 'init' | 'pending' | 'success' | 'error';
    username_pw_is_set: boolean;
}

export interface IState {
    auth: IAuth;
}
