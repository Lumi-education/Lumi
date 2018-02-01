export {
    default as CollectionListComponent
} from './components/collection-list';
export {
    default as CollectionCardsComponent
} from './components/collection-cards';
export {
    default as CollectionCardsContainer
} from './container/collection-cards';
export {
    default as CollectionSettingsContainer
} from './container/collection-settings';
export {
    default as CollectionEvaluationContainer
} from './container/collection-evaluation';
export {
    default as CollectionOverviewContainer
} from './container/collection-overview';

export {
    default as CollectionAssignmentContainer
} from './container/collection-assignments';

export {
    default as CollectionListContainer
} from './container/collection-list';
import CollectionAssignDialogContainer from './container/collection-assign-dialog';
import CollectionsChipInputContainer from './container/collection-chip-input';
import CollectionNameContainer from './container/collection-name';
import CollectionSubmittedContainer from './container/collection-submitted';
export {
    ICollection,
    ICollectionSubmitMsg,
    ICollectionUI,
    IState
} from './types';

import * as selectors from './selectors';
import * as actions from './actions';
import * as reducer from './reducer';
import { default as CollectionListContainer } from './container/collection-list';
import { default as CollectionAssignmentsContainer } from './container/collection-assignments';
const container = {
    AssignDialog: CollectionAssignDialogContainer,
    ChipInput: CollectionsChipInputContainer,
    List: CollectionListContainer,
    Assignments: CollectionAssignmentsContainer,
    Name: CollectionNameContainer,
    Submitted: CollectionSubmittedContainer
};

export { actions, selectors, reducer, container };
