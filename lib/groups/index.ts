export { default as GroupsInput } from './container/group-input';
export { IState, IGroup } from './types';
export { default as GroupSettingsContainer } from './container/group-settings';
import * as selectors from './selectors';
import * as actions from './actions';
import reducer from './reducer';
export { selectors, actions, reducer };
