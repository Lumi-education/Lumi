export interface IAuth {
    userlevel: number;
    user_id: string;
    username: string;
    username_validated: boolean;
    email: {
        email: string;
        validated: boolean;
    };
    login_state: 'init' | 'pending' | 'success' | 'error';
    error_message: string;
    password: string;
}

export interface IState {
    auth: IAuth;
}
