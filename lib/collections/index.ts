export {
    default as CollectionListComponent
} from './components/collection-list';
export {
    default as CollectionCardsComponent
} from './components/collection-cards';
export {
    default as CollectionSettingsContainer
} from './container/collection-settings';
export {
    default as CollectionListContainer
} from './container/collection-list';
export {
    default as CollectionSettingsComponent
} from './components/collection-settings';
import CollectionsChipInputContainer from './container/collection-chip-input';
import CollectionNameContainer from './container/collection-name';
import CollectionStateContainer from './container/collection-state';
import CollectionDueDateContainer from './container/collection-due-date';
import CollectionIsGradedContainer from './container/collection-is-graded';
export {
    default as CollectionSubmitSelectedButtonContainer
} from './container/collection-submit-selected-button';
export {
    default as CollectionUnsubmitSelectedButtonContainer
} from './container/collection-unsubmit-selected-button';

export {
    ICollection,
    ICollectionSubmitMsg,
    ICollectionUI,
    ICollectionData,
    IState
} from './types';

import * as selectors from './selectors';
import * as actions from './actions';
import * as reducer from './reducer';
import { default as CollectionListContainer } from './container/collection-list';
const container = {
    ChipInput: CollectionsChipInputContainer,
    List: CollectionListContainer,
    Name: CollectionNameContainer,
    State: CollectionStateContainer,
    DueDate: CollectionDueDateContainer,
    IsGraded: CollectionIsGradedContainer
};

export { actions, selectors, reducer, container };
