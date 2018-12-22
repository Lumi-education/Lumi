import { applyMiddleware, compose, createStore } from 'redux';
import * as createRavenMiddleware from 'raven-for-redux';
import raven from 'lib/core/raven';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import apiMiddleware from './middleware/redux-api-middleware';
import thunk from 'redux-thunk';

import { loadTranslations, syncTranslationWithStore } from 'react-redux-i18n';

declare var window;

import root_reducer from '../state';
import i18n from '../i18n';

const history = createBrowserHistory();

const persistentState = undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    connectRouter(history)(root_reducer),
    persistentState,
    composeEnhancers(
        applyMiddleware(
            thunk,
            routerMiddleware(history),
            apiMiddleware,
            createRavenMiddleware(raven)
        )
    )
);

syncTranslationWithStore(store);
store.dispatch(loadTranslations(i18n));

export default store;

export { history };
