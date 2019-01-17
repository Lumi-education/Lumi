import { assign, uniq } from 'lodash';

import {
    MATERIAL_UI_CHANGE_MATERIAL,
    MATERIAL_UI_RESET_MATERIAL,
    MATERIAL_UI_SET_SELECTED_MATERIAL,
    MATERIAL_SELECT,
    MATERIAL_SELECTION_RESET,
    MATERIAL_UI_SET_MATERIAL,
    MATERIAL_ADD_MATERIAL_TO_SELECTION,
    MATERIAL_REMOVE_MATERIAL_FROM_SELECTION
} from '../actions';

import { IMaterialUI } from '../types';

import * as Flow from 'lib/flow';

const initialState: IMaterialUI = {
    selected_material: [],
    material: {
        material_type: 'h5p'
    }
};

export default function(
    state: IMaterialUI = initialState,
    action
): IMaterialUI {
    switch (action.type) {
        case MATERIAL_SELECT:
            if (
                state.selected_material.indexOf(action.payload.material_id) > -1
            ) {
                return assign({}, state, {
                    selected_material: state.selected_material.filter(
                        c => c !== action.payload.material_id
                    )
                });
            }
            return assign({}, state, {
                selected_material: [
                    ...state.selected_material,
                    action.payload.material_id
                ]
            });

        case MATERIAL_SELECTION_RESET:
        case Flow.actions.FLOW_ASSIGN_SUCCESS:
            return assign({}, state, { selected_material: [] });

        case MATERIAL_ADD_MATERIAL_TO_SELECTION:
            const index =
                action.index !== undefined
                    ? action.index
                    : state.selected_material.length;
            return assign({}, state, {
                selected_material: uniq([
                    ...state.selected_material.slice(0, index),
                    action.material_id,
                    ...state.selected_material.slice(index)
                ]).filter(
                    material_id =>
                        material_id !== 'no_id' && material_id !== null
                )
            });

        case MATERIAL_REMOVE_MATERIAL_FROM_SELECTION:
            return assign({}, state, {
                selected_material: state.selected_material.filter(
                    material_id => material_id !== action.material_id
                )
            });

        case MATERIAL_UI_SET_SELECTED_MATERIAL:
            return assign({}, state, {
                selected_material: action.material_ids.filter(
                    material_id =>
                        material_id !== 'no_id' && material_id !== null
                )
            });

        case MATERIAL_UI_CHANGE_MATERIAL:
            const new_material = assign({}, state.material, action.payload);
            return assign({}, state, { material: new_material });

        case MATERIAL_UI_SET_MATERIAL:
            return {
                ...state,
                material: action.payload
            };

        case MATERIAL_UI_RESET_MATERIAL:
            return assign({}, state, {
                material: initialState.material
            });

        default:
            return state;
    }
}
