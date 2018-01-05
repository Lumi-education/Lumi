import { Map } from 'immutable';

import { ICard, IData, ICollectionData } from 'lib/cards/types';

import { IState as ITags } from 'lib/tags';
import { IState as IInstall } from 'lib/install';
import { IState as IAuth } from 'lib/auth';
import { IUI } from 'lib/ui/reducer';
import { IState as IUsers } from 'lib/users';
import { IState as IGroups } from 'lib/groups';
import { IState as ICollection } from 'lib/collections';

export interface IState
    extends ITags,
        IInstall,
        IAuth,
        IUsers,
        IGroups,
        ICollection {
    cards: {
        map: Map<string, ICard>;
    };
    data: {
        map: Map<string, IData>;
    };
    ui: IUI;
}
