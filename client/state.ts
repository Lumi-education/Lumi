import { combineReducers } from 'redux';

import { i18nReducer } from 'react-redux-i18n';

import { IState as IAuth, auth_reducer as auth } from 'lib/auth';
import { IState as ICards, reducer as cards } from 'lib/cards';
import { IState as IGroups, reducer as groups } from 'lib/groups';
import { IState as ITags, tags_reducer as tags } from 'lib/tags';
import { IState as IFlow, reducer as flow } from 'lib/flow';

import * as Core from 'lib/core';
import * as Comments from 'lib/comments';
import * as UI from 'lib/ui';
import * as Users from 'lib/users';

const root_reducer = combineReducers({
    auth,
    cards,
    groups,
    tags,
    flow,
    i18n: i18nReducer,
    core: Core.reducer,
    comments: Comments.reducer,
    ui: UI.reducer,
    users: Users.reducer
});
export default root_reducer;

export interface IState
    extends ICards,
        ITags,
        Core.types.IState,
        IAuth,
        Comments.types.IState,
        Users.types.IState,
        IGroups,
        UI.types.IState,
        IFlow {}
