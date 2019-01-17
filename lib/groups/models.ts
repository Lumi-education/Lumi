import { assign } from 'lodash';

import { IGroup } from './types';

export class Group implements IGroup {
    public _id: string;
    public _rev: string;
    public _deleted: boolean;
    public _attachments: any;
    public type: 'group';
    public name: string;
    public created_at: Date;
    public autojoin: boolean;
    public material_ids: string[];

    constructor(g?: any) {
        const init: IGroup = {
            _id: undefined,
            _rev: undefined,
            _deleted: false,
            _attachments: {},
            type: 'group',
            name: '',
            created_at: new Date(),
            autojoin: false,
            material_ids: []
        };
        return assign(this, init, g);
    }

    public add_material(material_ids: string[]): Group {
        return assign({}, this, {
            material_ids: [...this.material_ids, ...material_ids]
        });
    }
}
