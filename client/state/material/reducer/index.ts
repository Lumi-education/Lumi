import { combineReducers } from 'redux';

import list from './list';
import meta from './meta';

const reducer = combineReducers({
    list,
    meta
});

export default reducer;
