import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { Map } from 'immutable';

import { browserHistory, Route, Router } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import apiMiddleware from '../middleware/redux-api-middleware';
import thunk from 'redux-thunk';

declare var window;
declare var process;

import auth from './auth/reducer';
import cards from './cards/reducer';
import collections from './collections/reducer';
import groups from './groups/reducer';
import material from './material/reducer';
import request from './request/reducer';
import ui from './ui/reducer';
import session from './session/reducer';
import users from './users/reducer';
import tags from './tags/reducer';

import { State as Material } from './material/types';
import { State as UI } from './ui/types';
import { State as Request } from './request/types';
import { State as Session } from './session/types';
import { ICard, IGroup, IUser, ICollection, ITag } from 'lib/types';

export interface IState extends Material, UI, Request, Session {
  auth: {
    is_authed: boolean;
    response: number;
    userlevel: number;
  };
  cards: {
    map: Map<string, ICard>;
  };
  users: {
    list: Array<IUser>;
  };
  groups: {
    list: Map<string, IGroup>;
  };
  collections: {
    list: Array<ICollection>;
  };
  tags: {
    list: Map<string, ITag>;
  };
}

const rootReducer = combineReducers({
  auth,
  cards,
  collections,
  groups,
  material,
  ui,
  request,
  routing: routerReducer,
  users,
  tags,
  session
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
