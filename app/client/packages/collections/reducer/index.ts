import { combineReducers } from 'redux';

import list from './list';
import data from './data';
import ui from './ui';

const reducer = combineReducers({
    list,
    data,
    ui
});

export default reducer;
