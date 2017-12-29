import { Map } from 'immutable';

import { IGroup, ICollection, ISession } from 'common/types';

import { ICard, IData, ICollectionData } from 'client/packages/cards/types';

import { IState as ITags } from 'client/packages/tags';
import { IState as IInstall } from 'client/packages/install';
import { IState as IAuth } from 'client/packages/auth';
import { IUI } from 'client/packages/ui/reducer';
import { IState as IUsers } from 'client/packages/users';

export interface IState extends ITags, IInstall, IAuth, IUsers {
    cards: {
        map: Map<string, ICard>;
    };
    groups: {
        list: Map<string, IGroup>;
    };
    collections: {
        list: ICollection[];
        data: ICollectionData[];
    };
    session: ISession[];
    data: {
        map: Map<string, IData>;
    };
    ui: IUI;
}
