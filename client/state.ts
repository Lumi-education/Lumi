import { combineReducers } from 'redux';

import { i18nReducer } from 'react-redux-i18n';

import { IState as ICards, reducer as cards } from 'lib/cards';

import * as Auth from 'lib/auth';
import * as Core from 'lib/core';
import * as Comments from 'lib/comments';
import * as DB from 'lib/db';
import * as Flow from 'lib/flow';
import * as Groups from 'lib/groups';
import * as Tags from 'lib/tags';
import * as UI from 'lib/ui';
import * as Users from 'lib/users';
import * as Material from 'lib/material';

const root_reducer = combineReducers({
    cards,
    auth: Auth.reducer,
    core: Core.reducer,
    comments: Comments.reducer,
    db: DB.reducer,
    flow: Flow.reducer,
    groups: Groups.reducer,
    i18n: i18nReducer,
    material: Material.reducer,
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
        DB.types.IState,
        Comments.types.IState,
        Material.types.IState,
        Users.types.IState,
        Groups.types.IState,
        UI.types.IState,
        Flow.types.IState {}
