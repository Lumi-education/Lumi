import { combineReducers } from 'redux';

import map from './map';
import ui from './ui';

const reducer = combineReducers({
    map,
    ui
});

export default reducer;
