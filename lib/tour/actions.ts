export const TOUR_NEXT = 'TOUR_NEXT';
export const TOUR_SHOW = 'TOUR_SHOW';
export const TOUR_HIDE = 'TOUR_HIDE';

import * as UI from 'lib/ui';
import * as Groups from 'lib/groups';

export function next(current_step: number) {
    return dispatch => {
        function _next() {
            dispatch({
                type: TOUR_NEXT
            });
        }

        switch (current_step) {
            case 0:
                dispatch(UI.actions.left_drawer_open());
                setTimeout(_next, 250);
                break;
            case 1:
                dispatch(UI.actions.push('/admin/groups'));
                _next();
                break;
            case 2:
                dispatch(Groups.actions.ui_open_dialog('create'));
                setTimeout(_next, 250);
                break;
            default:
                _next();
        }
    };
}

export function show(tour_type: 'admin' | 'user') {
    return {
        payload: tour_type,
        type: TOUR_SHOW
    };
}

export function hide() {
    return {
        type: TOUR_HIDE
    };
}
