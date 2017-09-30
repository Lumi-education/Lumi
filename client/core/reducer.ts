import { routerReducer }           from 'react-router-redux';
import { combineReducers }         from 'redux';

import auth                        from '../state/auth/reducer';
// import collection                  from 'lib/collection/reducer';
// import group                       from 'lib/group/reducer';
// import material                    from 'lib/material/reducer';
import request                     from '../state/request/reducer';
// import settings                    from 'lib/settings/reducer';
import ui                          from '../state/ui/reducer';
// import user                        from 'lib/user/reducer';

const rootReducer = combineReducers({
    auth,
    // user,
    // collection,
    ui,
    request,
    routing: routerReducer,
    // material,
    // ui,
    // settings,
    // group,
});

export default rootReducer;
