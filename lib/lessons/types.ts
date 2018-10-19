import { Card_id } from '../cards/types';
import { User_id } from 'lib/users/types';

export type Lesson_id = string;

export interface ILesson {
    _id: Lesson_id;
    type: 'lesson';
    name: string;
    attendees: User_id[];
    expected_attendees: User_id[];
    cards: Card_id[];
}

export interface IState {
    lessons: {
        list: ILesson[];
    };
}
