import { IState } from './types';
import { Material } from './models';

export function material_edit(state: IState): Material {
    return new Material(state.material.ui.material);
}

export function material(state: IState, material_id: string): Material {
    return new Material(
        state.material.list.filter(m => m._id === material_id)[0]
    );
}

export function all(state: IState): Material[] {
    return state.material.list.map(m => new Material(m));
}

export function selected_material(state: IState): Material[] {
    return state.material.ui.selected_material.map(material_id =>
        material(state, material_id)
    );
}
