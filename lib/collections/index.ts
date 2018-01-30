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
    default as CollectionListContainer
} from './container/collection-list';

import CollectionAssignDialogContainer from './container/collection-assign-dialog';
import CollectionsChipInputContainer from './container/collection-chip-input';

export {
    ICollection,
    ICollectionSubmitMsg,
    ICollectionUI,
    IState
} from './types';

import * as selectors from './selectors';
import * as actions from './actions';
import * as reducer from './reducer';

const container = {
    AssignDialog: CollectionAssignDialogContainer,
    ChipInput: CollectionsChipInputContainer
};

export { actions, selectors, reducer, container };
