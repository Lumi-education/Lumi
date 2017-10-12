import {
	applyMiddleware,
	compose,
	createStore,
} 								from 'redux';

import { throttle } 			from 'lodash';

import { 
	browserHistory, 
	Route, 
	Router 
} 								from 'react-router';
import { routerMiddleware } 	from 'react-router-redux';
import apiMiddleware	 		from './redux-api-middleware';
import thunk 		   			from 'redux-thunk';

import rootReducer              from '../reducer';

declare var window;
declare var process;

export function loadState() {
	try {
		const serializedState = localStorage.getItem('state');
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch ( err ) { return undefined; }
}

export function saveState(state: {}) {
	const serializedState = JSON.stringify(state);
	localStorage.setItem('state', serializedState);
}

const persistentState = undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<{}>(
	rootReducer, 
	persistentState, 
	composeEnhancers(
		applyMiddleware(
			thunk, 
			routerMiddleware(browserHistory),
			apiMiddleware
		)
	)
);

// if (process.env.NODE_ENV === 'production') {
// 	store.subscribe(throttle( () => {
// 		saveState( store.getState() );
// 	},                        1000) );
// }

export default store;
