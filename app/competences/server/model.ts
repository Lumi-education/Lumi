import { assign } from 'lodash';
import { ICompetence } from '../types';

import { DB } from 'server/db';
import Relations from 'server/db/relations';

export default class Competence extends Relations implements ICompetence {
    public _id: string;
    public type: 'competence';
    public name: string;
    public description: string;
    public created_at: Date;
    public short_name: string;
    public color: string;

    constructor(t?: Competence) {
        super();
        return assign(
            this,
            {
                type: 'competence',
                name: 'new Competence',
                short_name: 'new',
                color: '#BCBCBC',
                description: '',
                created_at: new Date()
            },
            t
        );
    }

    public set_name(name: string): void {
        this.name = name;
    }
}
