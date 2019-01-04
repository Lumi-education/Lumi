import { assign } from 'lodash';
import * as Core from 'lib/core';

import { User } from './models';
import * as DB from 'lib/db';

export function create_users(users: User[]): Promise<User[]> {
    return DB.api.batch_create<User>(users).then(created_users => {
        return DB.db.get('_design/user').then(_design => {
            let design = _design;
            created_users.forEach(
                user => (design = add_view_to_user(design, user._id))
            );

            return DB.db.put(design).then(update_design => {
                return created_users;
            });
        });
    });
}

export function update(users: User[]): Promise<User[]> {
    return DB.api.batch_update<User>(users);
}

export function delete_users(users: User[]): Promise<User[]> {
    return DB.api.remove<User>(users);
}

function add_view_to_user(_design, user_id: string) {
    try {
        const new_view = {};
        new_view[user_id] = {
            map: "function (doc) {\n  if (doc.user_id === '__USERID__') { \n    emit('__USERID__', 1); \n    if (doc.type === 'assignment') { emit('__USERID__', { _id: doc.card_id }) }\n  }\n  if (doc.type === 'user' && doc._id === '__USERID__') {\n    emit('__USERID__', 1);\n    doc.groups.forEach(function(group_id)  { emit('__USERID__', {_id: group_id })} );\n  }\n}".replace(
                /__USERID__/g,
                user_id
            )
        };
        const views = assign({}, _design.views, new_view);

        _design.views = views;
        return _design;
    } catch (error) {
        Core.raven.captureException(error);
        return _design;
    }
}
