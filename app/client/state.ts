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
import { IState as IInstall } from 'client/packages/install';

export interface IState extends ITags, IInstall {
    auth: {
        is_authed: boolean;
        response: number;
        userlevel: number;
        user_id: string;
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
    session: ISession[];
    data: {
        map: Map<string, IData>;
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
