import { DB } from '../../db';
import event from '../../core/event';

export function assign_grade(grade) {
    const db = new DB(null);

    db.insert(grade, res => {
        db.findById(res.body.id, assigned_grade => {
            event.emit('GRADES/GRADE_ASSIGNED', assigned_grade);
        });
    });
}
