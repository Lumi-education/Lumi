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
import CollectionSubmittedContainer from './container/collection-submitted';
import CollectionDueDateContainer from './container/collection-due-date';
import CollectionIsGradedContainer from './container/collection-is-graded';
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
    Submitted: CollectionSubmittedContainer,
    DueDate: CollectionDueDateContainer,
    IsGraded: CollectionIsGradedContainer
};

export { actions, selectors, reducer, container };
