import {
	applyMiddleware,
	compose,
	createStore,
	combineReducers
} 									from 'redux';
import { routerReducer }           	from 'react-router-redux';

import { 
	browserHistory, 
	Route, 
	Router 
} 									from 'react-router';
import { routerMiddleware } 		from 'react-router-redux';
import apiMiddleware	 			from 'client/middleware/redux-api-middleware';
import thunk 		   				from 'redux-thunk';

declare var window;
declare var process;

import auth                        	from 'client/state/auth/reducer';
import collection                	from 'client/state/collection/reducer';
import groups 						from 'client/state/groups/reducer';
import material                  	from 'client/state//material/reducer';
import request                    	from 'client/state/request/reducer';
import ui                        	from 'client/state/ui/reducer';
import session                   	from 'client/state/session/reducer';
import users 						from 'client/state/users/reducer';

import { State as Auth } 			from './auth/types';
import { State as Collection }		from './collection/types';
import { State as Material }  		from './material/types';
import { State as UI } 				from './ui/types';
import { State as Request } 		from './request/types';
import { State as Session } 		from './session/types';
import { IUser } 					from 'lib/types';
import { IGroup } 					from 'lib/types';

export interface IState extends 
Auth,
Collection,
Material,
UI,
Request,
Session {
	users: {
		list: Array<IUser>;
	};
	groups: {
		list: Array<IGroup>;
	};
}

const rootReducer = combineReducers({
	auth,
	collection,
	groups,
	material,    
	ui,
	request,
	routing: routerReducer,
	users,
	session
});

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

export default store;
