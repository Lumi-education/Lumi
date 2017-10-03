import { State } from '../../state';
import { Dispatch } 	from 'redux';
import { Action } 		from '../../state/action-types';
import { assign } 		from 'lodash';

export default function callAPIMiddleware({ dispatch, getState }) {
	return next => action => {
	  const {
		types,
		api,
		shouldCallAPI = (state: State) => true,
		payload = {}
	  } = action;
  
	  if (!types) {
		// Normal action: pass it on
		return next(action);
	  }
  
	  if (
		!Array.isArray(types) ||
		types.length !== 3 ||
		!types.every(type => typeof type === 'string')
	  ) {
		throw new Error('Expected an array of three string types.');
	  }
  
	//   if (typeof api !== 'function') {
	// 	throw new Error('Expected api to be a function.');
	//   }
  
	  if (!shouldCallAPI(getState())) {
		return;
	  }
  
	  const [requestType, successType, failureType] = types;
  
	  dispatch(
		assign({}, payload, {
		  type: requestType
		})
	  );
  
	  return api.then(
		response =>
		  dispatch(
			assign({}, payload, {
				response: response,
				payload: response.body,
			  type: successType
			})
		  ),
		error =>
		  dispatch(
			assign({}, payload, {
				response: error,
				payload: error.body,
			  type: failureType
			})
		  )
	  );
	};
  }