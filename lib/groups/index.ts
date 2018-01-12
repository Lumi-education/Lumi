export { default as GroupsInputContainer } from './container/groups-input';
export { IState, IGroup, IGroupRef } from './types';
export { default as GroupSettingsContainer } from './container/group-settings';
import * as selectors from './selectors';
import * as actions from './actions';
import reducer from './reducer';
export { selectors, actions, reducer };
