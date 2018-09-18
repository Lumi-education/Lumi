import { IActivity, Activity_types } from 'lib/activity/types';
import * as raven from 'raven';
import db from '../db';

export function add_activity(
    user_id: string,
    activity_type: Activity_types,
    date: Date,
    assignment_id?: string
) {
    const activity: IActivity = {
        assignment_id,
        user_id,
        activity_type,
        date: date.toString(),
        _id: undefined,
        type: 'activity'
    };
    db.insert(activity, err => {
        if (err) {
            raven.captureException(err);
        }
    });
}
