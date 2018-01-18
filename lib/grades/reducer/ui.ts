import { assign, unionBy } from 'lodash';

import {
    GRADES_SHOW_CREATE_GRADE_DIALOG,
    GRADES_HIDE_CREATE_GRADE_DIALOG
} from '../actions';

import { IGradesUI } from '../';

const initialState: IGradesUI = {
    show_create_grades_dialog: false,
    user_id: undefined,
    grade_id: undefined
};

export default function(state: IGradesUI = initialState, action): IGradesUI {
    switch (action.type) {
        case GRADES_SHOW_CREATE_GRADE_DIALOG:
            return assign({}, state, {
                show_create_grades_dialog: true,
                user_id: action.user_id,
                grade_id: action.grade_id
            });

        case GRADES_HIDE_CREATE_GRADE_DIALOG:
            return assign({}, state, {
                show_create_grades_dialog: false,
                grade_id: undefined
            });
        default:
            return state;
    }
}
