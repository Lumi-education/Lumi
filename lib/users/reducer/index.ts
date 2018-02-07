import { combineReducers } from 'redux';

import list from './list';
import ui from './ui';

const reducer = combineReducers({
    list,
    ui
});

export default reducer;
