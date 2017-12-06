import { SESSION_GET_SESSION_ID_SUCCESS } from '../../action-types';

export default function(state: string = 'no_id', action): string {
    switch (action.type) {
        case SESSION_GET_SESSION_ID_SUCCESS:
            return action.payload.session_id;

        default:
            return state;
    }
}
