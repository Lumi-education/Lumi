import { routerReducer }           from 'react-router-redux';
import { combineReducers }         from 'redux';

import auth                        from '../state/auth/reducer';
import collection                  from '../state/collection/reducer';
import material                    from '../state//material/reducer';
import request                     from '../state/request/reducer';
import ui                          from '../state/ui/reducer';
import session                     from '../state/session/reducer';

const rootReducer = combineReducers({
	auth,
	collection,
	material,    
	ui,
	request,
	routing: routerReducer,
	session
});

export default rootReducer;
