import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { IState as IAuth, auth_reducer as auth } from 'lib/auth';
import { IState as ICards, reducer as cards } from 'lib/cards';
import * as Collections from 'lib/collections';
import collections from 'lib/collections/reducer';
import data from 'lib/data/reducer';
import { IState as IGroups, groups_reducer as groups } from 'lib/groups';
import { IState as ITags, tags_reducer as tags } from 'lib/tags';
import { IState as IInstall, install_reducer as install } from 'lib/install';
import { IState as IUI, ui_reducer as ui } from 'lib/ui';
import { IState as IUsers, users_reducer as users } from 'lib/users';

const root_reducer = combineReducers({
    auth,
    cards,
    collections,
    groups,
    ui,
    users,
    tags,
    data,
    install,
    routing: routerReducer
});
export default root_reducer;

export interface IState
    extends ICards,
        ITags,
        IInstall,
        IAuth,
        IUsers,
        IGroups,
        Collections.IState,
        IUI {}
