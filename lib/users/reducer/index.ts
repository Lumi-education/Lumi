import {combineReducers} from 'redux';

import list from './list';
import ui from './ui';
import me from './me';

const reducer = combineReducers({
    list,
    me,
    ui
});

export default reducer;
