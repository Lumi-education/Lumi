import { assign } from 'lodash';
import { ICompetence } from 'client/packages/competences/types';

import { DB } from '../db';

export default class Competence implements ICompetence {
    public _id: string;
    public type: 'competence';
    public name: string;
    public description: string;
    public created_at: Date;
    public short_name: string;
    public color: string;

    constructor(t?: Competence) {
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
