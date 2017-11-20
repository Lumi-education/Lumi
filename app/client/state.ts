import { Map } from 'immutable';

import {
    ICard,
    IGroup,
    IUser,
    ICollection,
    ITag,
    IData,
    ISession
} from 'common/types';

export interface IState {
    auth: {
        is_authed: boolean;
        response: number;
        userlevel: number;
    };
    cards: {
        map: Map<string, ICard>;
    };
    users: {
        list: IUser[];
    };
    groups: {
        list: Map<string, IGroup>;
    };
    collections: {
        list: ICollection[];
    };
    tags: {
        list: Map<string, ITag>;
    };
    request: {};
    session: ISession[];
    data: {
        map: Map<string, {}>;
    };
    ui: {
        left_drawer_show: boolean;
        right_drawer_show: boolean;
        dialog_show: boolean;
        snackbar_open: boolean;
        snackbar_text: string;
    };
}
