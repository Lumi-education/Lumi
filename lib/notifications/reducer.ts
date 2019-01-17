import * as Users from 'lib/users';
import * as Groups from 'lib/groups';
import * as Material from 'lib/material';
import * as DB from 'lib/db';
import * as Flow from 'lib/flow';

import { Notification } from './models';

const defaultState: Notification[] = [];

export default (state: Notification[] = defaultState, action) => {
    switch (action.type) {
        case Flow.actions.FLOW_ASSIGN_SUCCESS:
            return [
                ...state,
                new Notification('flow.assign.success', 'success')
            ];

        case Groups.actions.GROUPS_CREATE_SUCCESS:
            return [
                ...state,
                new Notification('groups.create.success', 'success')
            ];

        case Groups.actions.GROUPS_CREATE_ERROR:
            return [...state, new Notification('groups.create.error', 'error')];

        case Groups.actions.GROUPS_UPDATE_GROUP_SUCCESS:
            return [
                ...state,
                new Notification('groups.update.success', 'success')
            ];

        case Groups.actions.GROUPS_UPDATE_GROUP_ERROR:
            return [...state, new Notification('groups.update.error', 'error')];

        case Material.actions.MATERIAL_CREATE_SUCCESS:
            return [
                ...state,
                new Notification('material.create.success', 'success')
            ];

        case Material.actions.MATERIAL_CREATE_ERROR:
            return [
                ...state,
                new Notification('material.create.error', 'error')
            ];

        case Material.actions.MATERIAL_UPLOAD_H5P_SUCCESS:
            return [
                ...state,
                new Notification('material.upload.h5p.success', 'success')
            ];

        case Material.actions.MATERIAL_UPLOAD_H5P_ERROR:
            return [
                ...state,
                new Notification('material.upload.h5p.error', 'error')
            ];

        case Material.actions.MATERIAL_UPDATE_SUCCESS:
            return [
                ...state,
                new Notification('material.update.success', 'success')
            ];

        case Material.actions.MATERIAL_UPDATE_ERROR:
            return [
                ...state,
                new Notification('material.update.error', 'error')
            ];

        case Users.actions.USERS_CREATE_USER_SUCCESS:
            return [
                ...state,
                new Notification('users.create.success', 'success')
            ];

        case Users.actions.USERS_DELETE_USERS_SUCCESS:
            return [
                ...state,
                new Notification('users.delete.success', 'success')
            ];

        case Users.actions.USERS_UPDATE_USER_SUCCESS:
            return [
                ...state,
                new Notification('users.update.success', 'success')
            ];

        case Users.actions.USERS_UPDATE_USER_ERROR:
            return [...state, new Notification('users.update.error', 'error')];

        case Users.actions.USERS_CREATE_USER_ERROR:
            return [...state, new Notification('users.create.error', 'error')];

        case DB.actions.DB_START:
            return [...state, new Notification('db.sync.start', 'info')];

        case DB.actions.DB_COMPLETE:
            return [...state, new Notification('db.sync.success', 'success')];

        case DB.actions.DB_PAUSED:
            if (action.payload) {
                return [
                    ...state,
                    new Notification(action.payload.message, 'warning')
                ];
            }
            return state;

        default:
            // if (action.type.indexOf('_ERROR') > -1) {
            //     return [
            //         ...state,
            //         new Notification(action.error.message, 'error')
            //     ];
            // }
            return state;
    }
};
