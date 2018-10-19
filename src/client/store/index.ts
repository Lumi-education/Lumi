import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import * as createRavenMiddleware from 'raven-for-redux';
import raven from 'lib/core/raven';

import { browserHistory } from 'react-router';
import apiMiddleware from './middleware/redux-api-middleware';
import thunk from 'redux-thunk';

declare var window;

import root_reducer from '../state';

export function loadState() {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

export function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        raven.captureException(err);
    }
}

const persistentState = undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<{}>(
    root_reducer,
    persistentState,
    composeEnhancers(
        applyMiddleware(
            thunk,
            routerMiddleware(browserHistory),
            apiMiddleware,
            createRavenMiddleware(raven)
        )
    )
);

export default store;
