export type User_id = string;
type Group_id = string;

import { Locales } from 'lib/core/types';

export interface IUser {
    _id: User_id;
    _deleted: boolean;
    type: 'user';
    name: string;
    level: number;
    groups: Group_id[];
    last_login: Date;
    last_active: Date;
    online: boolean;
    location: string;
    password: string;
    flow: string[];
    language?: Locales;
}

export interface IState {
    users: {
        list: IUser[];
        ui: IUsersUI;
        me: IUser;
    };
}

export interface IUsersUI {
    selected_users: string[];
    user: IUser;
}
