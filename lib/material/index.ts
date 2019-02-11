import * as actions from './actions';
import * as components from './components';
import * as models from './models';
import reducer from './reducer';
import * as selectors from './selectors';
import * as types from './types';

import MaterialEditContainer from './container/MaterialEditContainer';

const container = {
    MaterialEditContainer
};

export { actions, components, container, models, reducer, selectors, types };
