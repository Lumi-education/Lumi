export { default as TagInputComponent } from './components/tag-input';
export { default as TagInputContainer } from './container/tag-input';
export { default as TagsFilterContainer } from './container/tag-filter';
export { default as TagListComponent } from './components/tag-list';

export { ITag, ITagRef, ITagsUI, IState } from './types';

export { default as tags_reducer } from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';

export { actions, selectors };
