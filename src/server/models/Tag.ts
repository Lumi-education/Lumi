import { assign } from 'lodash';

export default class Tag {
    public _id: string;
    public type: 'tag';
    public name: string;
    public description: string;
    public created_at: Date;
    public short_name: string;
    public color: string;

    constructor(t?: Tag) {
        return assign(
            this,
            {
                type: 'tag',
                name: 'new Tag',
                short_name: t.name.substring(0, 3) || 'new',
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
