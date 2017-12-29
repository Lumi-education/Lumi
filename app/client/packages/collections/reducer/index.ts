import { combineReducers } from 'redux';

import list from './list';
import data from './data';

const reducer = combineReducers({
    list,
    data
});

export default reducer;
