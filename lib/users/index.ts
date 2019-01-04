import * as types from './types';
import * as models from './models';
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';

import UserList from './components/UserList';
import UserListItem from './components/UserListItem';
import UserCreateDialog from './components/UserCreateDialog';
import UserDeleteDialog from './components/UserDeleteDialog';
import UserChipInput from './components/UserChipInput';
import UserSettings from './components/UserSettings';

const components = {
    UserCreateDialog,
    UserDeleteDialog,
    UserChipInput,
    UserSettings,
    List: UserList,
    ListItem: UserListItem
};

export { actions, components, models, reducer, selectors, types };
