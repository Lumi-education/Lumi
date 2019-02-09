import { combineReducers } from 'redux';

import { i18nReducer } from 'react-redux-i18n';

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
import * as Notifications from 'lib/notifications';
import * as Tour from 'lib/tour';

const root_reducer = combineReducers({
    auth: Auth.reducer,
    core: Core.reducer,
    comments: Comments.reducer,
    db: DB.reducer,
    flow: Flow.reducer,
    groups: Groups.reducer,
    i18n: i18nReducer,
    material: Material.reducer,
    notifications: Notifications.reducer,
    tags: Tags.reducer,
    ui: UI.reducer,
    users: Users.reducer,
    tour: Tour.reducer
});

export default root_reducer;

export interface IState
    extends Tags.types.IState,
        Core.types.IState,
        Auth.types.IState,
        DB.types.IState,
        Comments.types.IState,
        Material.types.IState,
        Users.types.IState,
        Groups.types.IState,
        UI.types.IState,
        Notifications.types.IState,
        Flow.types.IState,
        Tour.types.IState {}
