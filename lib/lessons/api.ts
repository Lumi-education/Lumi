import * as request from 'superagent';

import { Lesson } from './models';

declare var window;

export function create_lesson(name: string, cards: string[]) {
    return request
        .post('/api/v0/lessons')
        .send(
            new Lesson({
                name,
                cards,
                _id: undefined,
                type: 'lesson',
                attendees: [],
                expected_attendees: []
            })
        )
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}

export function get_lessons() {
    return request
        .get('/api/v0/lessons')
        .set('x-auth', window.localStorage.jwt_token || window.jwt_token || '');
}
