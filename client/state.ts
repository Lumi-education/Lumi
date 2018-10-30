import { combineReducers } from 'redux';

import { i18nReducer } from 'react-redux-i18n';

import { IState as IAuth, auth_reducer as auth } from 'lib/auth';
import { IState as ICards, reducer as cards } from 'lib/cards';
import { IState as IGroups, reducer as groups } from 'lib/groups';
import { IState as ITags, tags_reducer as tags } from 'lib/tags';
import { IState as IUI, ui_reducer as ui } from 'lib/ui';
import { IState as IUsers, users_reducer as users } from 'lib/users';
import { IState as IFlow, reducer as flow } from 'lib/flow';

import * as Core from 'lib/core';
import * as Folders from 'lib/folders';
import * as Activity from 'lib/activity';
import * as Comments from 'lib/comments';

const root_reducer = combineReducers({
    auth,
    cards,
    groups,
    ui,
    users,
    tags,
    flow,
    i18n: i18nReducer,
    core: Core.reducer,
    activity: Activity.reducer,
    comments: Comments.reducer,
    folders: Folders.reducer
});
export default root_reducer;

export interface IState
    extends ICards,
        ITags,
        Core.types.IState,
        IAuth,
        Activity.types.IState,
        Comments.types.IState,
        IUsers,
        Folders.types.IState,
        IGroups,
        IUI,
        IFlow {}
