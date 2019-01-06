import { assign } from 'lodash';

import { IUser } from 'lib/users/types';

const _core = {
    _id: 'core'
};
const _admin: IUser = {
    _id: 'admin',
    _rev: undefined,
    _deleted: false,
    type: 'user',
    name: 'admin',
    level: 4,
    groups: [],
    password: undefined,
    flow: [],
    _attachments: {}
};

const init = admin => [assign(_admin, admin), _core];

export default init;
