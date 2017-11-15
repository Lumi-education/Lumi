import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import { Map } from 'immutable';

import { browserHistory, Route, Router } from 'react-router';
import apiMiddleware from 'client/middleware/redux-api-middleware';
import thunk from 'redux-thunk';

declare var window;
declare var process;

import auth from 'client/state/auth/reducer';
import cards from 'client/state/cards/reducer';
import collections from 'client/state/collections/reducer';
import groups from 'client/state/groups/reducer';
import request from 'client/state/request/reducer';
import ui from 'client/state/ui/reducer';
import session from 'client/state/session/reducer';
import users from 'client/state/users/reducer';
import tags from 'client/state/tags/reducer';
import data from 'client/state/data/reducer';

import {
    ICard,
    IGroup,
    IUser,
    ICollection,
    ITag,
    IData,
    ISession
} from 'lib/types';

export interface IState {
    auth: {
        is_authed: boolean;
        response: number;
        userlevel: number;
    };
    cards: {
        map: Map<string, ICard>;
    };
    users: {
        list: IUser[];
    };
    groups: {
        list: Map<string, IGroup>;
    };
    collections: {
        list: ICollection[];
    };
    tags: {
        list: Map<string, ITag>;
    };
    request: {};
    session: ISession[];
    data: {
        map: Map<string, {}>;
    };
    ui: {
        left_drawer_show: boolean;
        right_drawer_show: boolean;
        dialog_show: boolean;
        snackbar_open: boolean;
        snackbar_text: string;
    };
}

const rootReducer = combineReducers({
    auth,
    cards,
    collections,
    groups,
    ui,
    request,
    users,
    tags,
    session,
    data,
    routing: routerReducer
});

const persistentState = undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<{}>(
    rootReducer,
    persistentState,
    composeEnhancers(
        applyMiddleware(thunk, routerMiddleware(browserHistory), apiMiddleware)
    )
);

export default store;
