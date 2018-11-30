import { combineReducers } from 'redux';

import list from './list';
import ui from './ui';
import card_search_menu from './CardSearchMenu';

const reducer = combineReducers({
    list,
    ui,
    card_search_menu
});

export default reducer;
