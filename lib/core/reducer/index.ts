import { combineReducers } from 'redux';

import system from './system';
import status from './status';

const reducer = combineReducers({
    status,
    system
});

export default reducer;
