import { DB } from '../../db';
import event from '../../core/event';

import { IGrade } from 'lib/grades';

export function assign_grade(grade: IGrade) {
    const db = new DB(null, process.env.DB);

    db.insert(grade, res => {
        db.findById(res.body.id, assigned_grade => {
            event.emit('GRADES/GRADE_ASSIGNED', assigned_grade);
        });
    });
}
