export type User_id = string;
import { IDoc, Locales } from 'lib/core/types';

export interface IUser extends IDoc {
    _id: User_id;
    _rev: string;
    _deleted: boolean;
    type: 'user';
    name: string;
    level: number;
    groups: string[];
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
    users_to_create: string[];
    username_to_create: string;
    error: {
        message: string;
    };

    dialogs: any;
    user_options: any;
}
