import { combineReducers } from 'redux';

import map from './map';
import refs from './refs';
import ui from './ui';

const reducer = combineReducers({
    map,
    refs,
    ui
});

export default reducer;
