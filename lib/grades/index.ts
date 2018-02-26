export { IGrade, IState, IGradesUI } from './types';
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import GradeRefContainer from './container/grade-ref';
export { default as GradeListContainer } from './container/grade-list';
export {
    default as CreateGradeDialogContainer
} from './container/create_grade_dialog';
export { default as CurrentGradeContainer } from './container/current_grade';
export {
    default as CurrentGradeListContainer
} from './container/current_grade_list';
import Grade from 'material-ui/svg-icons/action/grade';

const svg = {
    Grade
};

const container = {
    GradeRef: GradeRefContainer
};

export { actions, reducer, selectors, svg, container };
