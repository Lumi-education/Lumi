export { IState, IAssignment } from './types';
import * as selectors from './selectors';
import AssignmentEditContainer from './container/assignment-edit';
import * as actions from './actions';
import reducer from './reducer';
import * as models from './models';
const container = {
    AssignmentEdit: AssignmentEditContainer
};
export { actions, selectors, reducer, models, container };
