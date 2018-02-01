export { IState, IUser, IUsersUI } from './types';
export { default as UserListContainer } from './container/user-list';
export { default as UserContainer } from './container/user';
export { default as CreateUserContainer } from './container/create-user';
export { default as users_reducer } from './reducer';
import UserTableContainer from './container/user-table';
import UserOnlineStatusContainer from './container/user-online-status';
import UserChipInputContainer from './container/user-chip-input';

import * as selectors from './selectors';
import * as actions from './actions';

const container = {
    ChipInput: UserChipInputContainer,
    Table: UserTableContainer,
    OnlineStatus: UserOnlineStatusContainer
};
export { actions, selectors, container };
