import raven from 'lib/core/raven';

import { IState } from './types';

import { Lesson } from './models';

export function all(state: IState): Lesson[] {
    try {
        return state.lessons.list.map(c => new Lesson(c));
    } catch (error) {
        raven.captureException(error);
        return [];
    }
}

export function id(state: IState, lesson_id: string): Lesson {
    return new Lesson(state.lessons.list.filter(c => c._id === lesson_id)[0]);
}
