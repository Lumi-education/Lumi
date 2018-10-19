import { assign } from 'lodash';

import { ILesson, Lesson_id } from './types';
import { Card_id } from 'lib/cards/types';
import { User_id } from 'lib/users/types';

export class Lesson implements ILesson {
    public _id: Lesson_id;
    public type: 'lesson';
    public name: string;
    public cards: Card_id[];
    public attendees: User_id[];
    public expected_attendees: User_id[];

    constructor(c?: ILesson) {
        return assign(
            this,
            {
                _id: undefined,
                type: 'lesson',
                cards: [],
                attendees: [],
                expected_attendees: []
            },
            c
        );
    }
}
