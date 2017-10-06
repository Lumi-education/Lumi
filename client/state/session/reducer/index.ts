import { combineReducers }         from 'redux';

import list 						from './list';
import id 							from './id';

const reducer = combineReducers({
	list,
	id
});

export default reducer;