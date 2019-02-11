import { IAdminTour } from '../types';
import { unionBy, assign } from 'lodash';

import { TOUR_NEXT, TOUR_SHOW, TOUR_HIDE } from '../actions';

import * as Groups from 'lib/groups';

const initial_state: IAdminTour = {
    step: 0,
    show: false
};

export default function(state: IAdminTour = initial_state, action): IAdminTour {
    switch (action.type) {
        case TOUR_NEXT:
            return {
                ...state,
                step: state.step + 1
            };

        case '@@router/LOCATION_CHANGE':
            if (
                action.payload.location.pathname.indexOf('/admin/groups/') > -1
            ) {
                return {
                    ...state,
                    step: 4
                };
            }
            //     if (
            //         action.payload.location.pathname.indexOf('/admin/groups') > -1
            //     ) {
            //         return {
            //             ...state,
            //             step: 2
            //         };
            //     }

            return state;

        // case Groups.actions.GROUPS_UI_OPEN_DIALOG:
        //     return {
        //         ...state,
        //         step: 3
        //     };
        case TOUR_HIDE:
            return { ...state, show: false };

        case TOUR_SHOW:
            if (action.payload === 'admin') {
                return { ...state, show: true };
            }

        default:
            return state;
    }
}
