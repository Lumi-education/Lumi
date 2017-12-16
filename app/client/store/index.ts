import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import { Map } from 'immutable';

import { browserHistory, Route, Router } from 'react-router';
import apiMiddleware from './middleware/redux-api-middleware';
import debugMiddleware from './middleware/debug';
import thunk from 'redux-thunk';

declare var window;
declare var process;

import auth from 'client/packages/auth/reducer';
import cards from 'client/packages/cards/reducer';
import collections from 'client/packages/collections/reducer';
import groups from 'client/packages/groups/reducer';
import ui from 'client/packages/ui/reducer';
import session from 'client/packages/session/reducer';
import users from 'client/packages/users/reducer';
import tags from 'client/packages/tags/reducer';
import data from 'client/packages/data/reducer';
import install from 'client/packages/install/reducer';

const rootReducer = combineReducers({
    auth,
    cards,
    collections,
    groups,
    ui,
    users,
    tags,
    session,
    data,
    install,
    routing: routerReducer
});

const persistentState = undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<{}>(
    rootReducer,
    persistentState,
    composeEnhancers(
        applyMiddleware(
            debugMiddleware,
            thunk,
            routerMiddleware(browserHistory),
            apiMiddleware
        )
    )
);

export default store;
