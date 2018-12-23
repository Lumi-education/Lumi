import { combineReducers } from 'redux';

import { i18nReducer } from 'react-redux-i18n';

import { IState as ICards, reducer as cards } from 'lib/cards';

import * as Auth from 'lib/auth';
import * as Core from 'lib/core';
import * as Comments from 'lib/comments';
import * as Flow from 'lib/flow';
import * as Groups from 'lib/groups';
import * as Tags from 'lib/tags';
import * as UI from 'lib/ui';
import * as Users from 'lib/users';

const root_reducer = combineReducers({
    cards,
    auth: Auth.reducer,
    core: Core.reducer,
    comments: Comments.reducer,
    flow: Flow.reducer,
    groups: Groups.reducer,
    i18n: i18nReducer,
    tags: Tags.reducer,
    ui: UI.reducer,
    users: Users.reducer
});

export default root_reducer;

export interface IState
    extends ICards,
        Tags.types.IState,
        Core.types.IState,
        Auth.types.IState,
        Comments.types.IState,
        Users.types.IState,
        Groups.types.IState,
        UI.types.IState,
        Flow.types.IState {}
