import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { IState as IAuth, auth_reducer as auth } from '../../lib/auth';
import { IState as ICore, reducer as core } from '../../lib/core';
import { IState as ICards, reducer as cards } from '../../lib/cards';
import { IState as IGroups, reducer as groups } from '../../lib/groups';
import { IState as ITags, tags_reducer as tags } from '../../lib/tags';
import { IState as IUI, ui_reducer as ui } from '../../lib/ui';
import { IState as IUsers, users_reducer as users } from '../../lib/users';
import { IState as IGrades, reducer as grades } from '../../lib/grades';
import { IState as IFlow, reducer as flow } from '../../lib/flow';
import * as Activity from 'lib/activity';
import * as Comments from 'lib/comments';

const root_reducer = combineReducers({
    core,
    auth,
    cards,
    groups,
    ui,
    users,
    tags,
    flow,
    activity: Activity.reducer,
    comments: Comments.reducer,
    routing: routerReducer
});
export default root_reducer;

export interface IState
    extends ICards,
        ITags,
        ICore,
        IAuth,
        Activity.types.IState,
        Comments.types.IState,
        IUsers,
        IGroups,
        IUI,
        // IGrades,
        IFlow {}
