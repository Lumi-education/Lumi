import { assign } from 'lodash';

import { IGroup } from './types';

export class Group implements IGroup {
    public _id: string;
    public type: 'group';
    public name: string;
    public created_at: Date;
    public autojoin: boolean;
    public cards: string[];

    constructor(g?: any) {
        const init: IGroup = {
            _id: undefined,
            type: 'group',
            name: '__GROUP__',
            created_at: new Date(),
            autojoin: false,
            cards: []
        };
        return assign(this, init, g);
    }
}
