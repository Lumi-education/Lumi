import { combineReducers } from 'redux';

import assignments from './assignments';
import ui from './ui';

const reducer = combineReducers({ assignments, ui });

export default reducer;
