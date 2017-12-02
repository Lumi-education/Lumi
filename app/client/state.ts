import { Map } from 'immutable';

import {
    ICard,
    IGroup,
    IUser,
    ICollection,
    IData,
    ISession
} from 'common/types';

import { IState as ITags } from 'client/packages/tags';

export interface IState extends ITags {
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
        show_cards_dialog: boolean;
        selected_card_ids: string[];
    };
}
