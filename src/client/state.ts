import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { IState as IAuth, auth_reducer as auth } from 'lib/auth';
import { IState as ICore, reducer as core } from 'lib/core';
import { IState as ICards, reducer as cards } from 'lib/cards';
import * as Collections from 'lib/collections';
import collections from 'lib/collections/reducer';
import data from 'lib/data/reducer';
import { IState as IGroups, reducer as groups } from 'lib/groups';
import { IState as ITags, tags_reducer as tags } from 'lib/tags';
import { IState as IInstall, install_reducer as install } from 'lib/install';
import { IState as IUI, ui_reducer as ui } from 'lib/ui';
import { IState as IUsers, users_reducer as users } from 'lib/users';
import { IState as IGrades, reducer as grades } from 'lib/grades';

const root_reducer = combineReducers({
    core,
    auth,
    cards,
    collections,
    groups,
    ui,
    users,
    tags,
    data,
    install,
    grades,
    routing: routerReducer
});
export default root_reducer;

export interface IState
    extends ICards,
        ITags,
        ICore,
        IInstall,
        IAuth,
        IUsers,
        IGroups,
        Collections.IState,
        IUI,
        IGrades {}
