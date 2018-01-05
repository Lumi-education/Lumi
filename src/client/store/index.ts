import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import { Map } from 'immutable';

import { browserHistory, Route, Router } from 'react-router';
import apiMiddleware from './middleware/redux-api-middleware';
import debugMiddleware from './middleware/debug';
import gaTracker from './middleware/ga-tracker';
import thunk from 'redux-thunk';

declare var window;
declare var process;

import auth from 'lib/auth/reducer';
import cards from 'lib/cards/reducer';
import collections from 'lib/collections/reducer';
import groups from 'lib/groups/reducer';
import ui from 'lib/ui/reducer';
import users from 'lib/users/reducer';
import tags from 'lib/tags/reducer';
import data from 'lib/data/reducer';
import install from 'lib/install/reducer';

const rootReducer = combineReducers({
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

const persistentState = undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<{}>(
    rootReducer,
    persistentState,
    composeEnhancers(
        applyMiddleware(
            gaTracker,
            debugMiddleware,
            thunk,
            routerMiddleware(browserHistory),
            apiMiddleware
        )
    )
);

export default store;
