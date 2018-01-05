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

import root_reducer from '../state';

const persistentState = undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<{}>(
    root_reducer,
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
