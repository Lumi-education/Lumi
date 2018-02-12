export interface IAuth {
    userlevel: number;
    user_id: string;
    username: string;
    password: string;
}

export interface IState {
    auth: IAuth;
}
