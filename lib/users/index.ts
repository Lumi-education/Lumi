export { IState, IUser, IUsersUI } from './types';
export { default as UserContainer } from './container/user';
export { default as users_reducer } from './reducer';
import UserChipInputContainer from './container/user-chip-input';
import * as selectors from './selectors';
import * as actions from './actions';

const container = {
    ChipInput: UserChipInputContainer
};
export { actions, selectors, container };
