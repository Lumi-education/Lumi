import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import * as createRavenMiddleware from 'raven-for-redux';
import * as raven from 'raven-js';

import { browserHistory } from 'react-router';
import apiMiddleware from './middleware/redux-api-middleware';
import thunk from 'redux-thunk';

declare var window;

import root_reducer from '../state';

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
