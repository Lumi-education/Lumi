import { Activity } from './models';
import { IState, Activity_id } from './types';

import { sortBy } from 'lodash';

export function last_30_activies(
    state: IState,
    num_elements: number
): Activity[] {
    return state.activity.list
        .map(a => new Activity(a))
        .sort((a, b) => b.get_date().unix() - a.get_date().unix())
        .slice(0, num_elements);
}

export function by_id(state: IState, activity_id: Activity_id): Activity {
    return new Activity(
        state.activity.list.filter(a => a._id === activity_id)[0]
    );
}
