import { IDoc } from 'lib/core/types';
import { IH5P, IContent } from 'h5p-nodejs-library';
export type Material_types = 'h5p';

export interface IMaterial extends IDoc {
    type: 'material';
    material_type: Material_types;
    name: string;
}

export interface IH5PMaterial extends IMaterial {
    h5p: IH5P;
    content: IContent;
}

export interface IMaterialUI {
    selected_material: string[];
    material: any;
}

export interface IState {
    material: {
        list: IMaterial[];
        ui: IMaterialUI;
    };
}
