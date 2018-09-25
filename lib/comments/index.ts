import * as actions from './actions';
import * as types from './types';
import * as selectors from './selectors';
import * as models from './models';
import reducer from './reducer';
import Comment from './components/comment';

const components = {
    Comment
};

export { actions, components, types, models, reducer, selectors };
