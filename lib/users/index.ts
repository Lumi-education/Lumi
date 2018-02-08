export { IState, IUser, IUsersUI } from './types';
export { default as UserContainer } from './container/user';
export { default as CreateUserContainer } from './container/create-user';
export { default as users_reducer } from './reducer';
import UserOnlineStatusContainer from './container/user-online-status';
import UserChipInputContainer from './container/user-chip-input';
import UserNameContainer from './container/user-name';
import * as selectors from './selectors';
import * as actions from './actions';

const container = {
    ChipInput: UserChipInputContainer,
    OnlineStatus: UserOnlineStatusContainer,
    Name: UserNameContainer
};
export { actions, selectors, container };
