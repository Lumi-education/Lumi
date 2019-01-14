import { IMaterial, Material_types } from './types';
import { assign } from 'lodash';

export class Material implements IMaterial {
    public _id: string;
    public _rev: string;
    public _deleted: boolean;
    public _attachments: any;
    public type: 'material';
    public material_type: Material_types;
    public name: string;

    constructor(m?: any) {
        assign(
            this,
            {
                _attachments: {},
                _deleted: false,
                type: 'material',
                material_type: 'h5p',
                name: ''
            },
            m
        );
    }
}
