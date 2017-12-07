import * as API from './api';

export const INSTALL_GET_STATUS_REQUEST = 'INSTALL_GET_STATUS_REQUEST';
export const INSTALL_GET_STATUS_SUCCESS = 'INSTALL_GET_STATUS_SUCCESS';
export const INSTALL_GET_STATUS_ERROR = 'INSTALL_GET_STATUS_ERROR';

export const INSTALL_REGISTER_ADMIN_REQUEST = 'INSTALL_REGISTER_ADMIN_REQUEST';
export const INSTALL_REGISTER_ADMIN_SUCCESS = 'INSTALL_REGISTER_ADMIN_SUCCESS';
export const INSTALL_REGISTER_ADMIN_ERROR = 'INSTALL_REGISTER_ADMIN_ERROR';

export function get_install() {
    return {
        types: [
            INSTALL_GET_STATUS_REQUEST,
            INSTALL_GET_STATUS_SUCCESS,
            INSTALL_GET_STATUS_ERROR
        ],
        api: API.get_install()
    };
}

// export function register_admin(username: string, password: string) {
//     return {
//         types: [
//             INSTALL_REGISTER_ADMIN_REQUEST,
//             INSTALL_REGISTER_ADMIN_SUCCESS,
//             INSTALL_REGISTER_ADMIN_ERROR
//         ],
//         api: API.register_admin(username, password)
//     };
// }
