import { Map } from 'immutable';

import { IGroup, IUser, ICollection, ISession } from 'common/types';

import { ICard, IData } from 'client/packages/cards/types';

import { IState as ITags } from 'client/packages/tags';
import { IState as IInstall } from 'client/packages/install';
import { IState as IAuth } from 'client/packages/auth';

export interface IState extends ITags, IInstall, IAuth {
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
        right_appbar_icon: JSX.Element;
        tags_filter: string[];
    };
}
