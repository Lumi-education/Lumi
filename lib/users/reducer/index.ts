import { combineReducers } from 'redux';

import list from './list';
import ui from './ui';
import me from './me';

const reducer = combineReducers({
    list,
    ui,
    me
});

export default reducer;
