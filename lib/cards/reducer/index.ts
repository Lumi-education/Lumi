import { combineReducers } from 'redux';

import data from './data';
import map from './map';
import ui from './ui';

const reducer = combineReducers({
    data,
    map,
    ui
});

export default reducer;
