import { combineReducers } from 'redux';

import map from './map';
import refs from './refs';

const reducer = combineReducers({
    map,
    refs
});

export default reducer;
