import db from '../';
import * as debug from 'debug';
const log = debug('db:setup:migration');

export default function migrate(done: () => void) {
    // finished not set & data saved wrong in multiplechoice-question

    db.find(
        { type: 'assignment' },
        { limit: 1000 },
        (find_assignment_error, assignments) => {
            log(
                'migrating ' +
                    assignments.length +
                    ' assignments. Setting finished-field and updating data-field from array to object.'
            );

            let i = 0;

            assignments.forEach(assignment => {
                if (Array.isArray(assignment.data)) {
                    assignment.finished = assignment.data[0].finished;
                    assignment.data = assignment.data[0];
                    i++;
                }
            });

            db.updateMany(assignments, {}, (update_assignment_error, docs) => {
                log('migrated ' + i + ' assigments.');
                done();
            });
        }
    );
}