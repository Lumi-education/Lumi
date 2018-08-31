import * as express from 'express';
import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';
import * as raven from 'raven';

import db from '../../db';

import { IAssignment } from '../../../../lib/flow/types';
import { IUser } from '../../../../lib/users/types';

class FlowController {
    public get_assignments(req: IRequest, res: express.Response) {
        db.find(
            assign(
                {
                    type: 'assignment'
                },
                req.query
            ),
            {},
            (error, docs) => {
                res.status(200).json(docs);
            }
        );
    }

    public update_assignments(req: IRequest, res: express.Response) {
        db.find(
            { type: 'assignment', _id: { $in: req.body.assignment_ids } },
            { limit: req.body.assignment_ids.length },
            (find_assignments_error, assignments) => {
                const updated_assignments = assignments.map(assignment =>
                    assign({}, assignment, req.body.update)
                );

                db.updateMany(
                    updated_assignments,
                    {},
                    (update_assignments_error, response) => {
                        res.status(200).json(updated_assignments);
                    }
                );
            }
        );
    }

    public delete_assignments(req: IRequest, res: express.Response) {
        db.find(
            { type: 'assignment', _id: { $in: req.body.assignment_ids } },
            { limit: req.body.assignment_ids.length },
            (find_assignments_error, assignments) => {
                assignments.forEach(assignment => (assignment._deleted = true));
                db.updateMany(assignments, {}, (delete_error, docs) => {
                    db.find(
                        {
                            type: 'user',
                            flow: { $in: req.body.assignment_ids }
                        },
                        { limit: req.body.assignment_ids.length },
                        (find_user_error, users) => {
                            users.forEach(
                                user =>
                                    (user.flow = user.flow.filter(
                                        assignment_id =>
                                            req.body.assignment_ids.indexOf(
                                                assignment_id
                                            ) === -1
                                    ))
                            );

                            db.updateMany(
                                users,
                                {},
                                (update_user_error, update_user_doc) => {
                                    res.status(200).json([assignments, users]);
                                }
                            );
                        }
                    );
                });
            }
        );
    }

    public save_state(req: IRequest, res: express.Response) {
        db.findById(
            req.params.assignment_id,
            (error, assignment: IAssignment) => {
                assignment.state = req.body;

                db.updateOne(req.params.assignment_id, assignment, a => {
                    res.status(200).end();
                });
            }
        );
    }

    public save_data(req: IRequest, res: express.Response) {
        db.findById(
            req.params.assignment_id,
            (error, assignment: IAssignment) => {
                assignment.data = req.body;
                assignment.state = req.body.state;

                db.updateOne(req.params.assignment_id, assignment, (err, a) => {
                    res.status(200).json(assignment.data);
                });
            }
        );
    }

    public get_state(req: IRequest, res: express.Response) {
        db.findById(
            req.params.assignment_id,
            (error, assignment: IAssignment) => {
                res.status(200).json(
                    assign(assignment.state, { success: true })
                );
            }
        );
    }

    public assign(req: IRequest, res: express.Response) {
        // required params: user_id[] && card_id[] && group_id

        if (!req.body.user_ids || !req.body.card_ids) {
            return res.status(400).json({ message: 'invalid body' });
        }

        const _assignments: IAssignment[] = [];

        req.body.card_ids.forEach(card_id => {
            req.body.user_ids.forEach(user_id => {
                const _assignment: IAssignment = {
                    user_id,
                    card_id,
                    type: 'assignment',
                    completed: false,
                    data: {},
                    state: null,
                    archived: false,
                    finished: null,
                    time: null,
                    sync: 'success',
                    _attachments: {}
                };

                _assignments.push(_assignment);
            });
        });

        db.insertMany(_assignments, {}, (err, result) => {
            if (err) {
                raven.captureException(err);
                return res.status(400).json(err);
            }
            _assignments.map((a, i) => {
                return assign(a, { _id: result[i].id });
            });

            db.find(
                {
                    _id: {
                        $in: req.body.user_ids
                    }
                },
                {
                    limit: 40
                },
                (find_error, users) => {
                    if (find_error) {
                        raven.captureException(err);
                        return res.status(400).json(err);
                    }
                    users.map(user => {
                        user.flow = [
                            ...user.flow,
                            ..._assignments
                                .filter(
                                    assignment =>
                                        assignment.user_id === user._id
                                )
                                .map(assignment => assignment._id)
                        ];
                        return user;
                    });

                    db.insertMany(users, {}, (error, r) => {
                        res.status(200).json(_assignments);
                    });
                }
            );
        });
    }

    public sync_assignments(req: IRequest, res: express.Response) {
        const assignments = req.body.assignments;

        assignments.forEach(assignment => (assignment.sync = 'success'));

        db.updateMany(assignments, {}, (update_assignments_error, docs) => {
            res.status(200).json(assignments);
        });
    }

    public archive_assignments(req: IRequest, res: express.Response) {
        if (!req.body.assignment_ids) {
            return res.status(400).json({ message: 'invalid body' });
        }

        const assignment_ids = req.body.assignment_ids;

        db.find(
            {
                _id: { $in: assignment_ids },
                type: 'assignment'
            },
            { limit: assignment_ids.length },
            (find_assignments_error, assignments: IAssignment[]) => {
                assignments.forEach(assignment => (assignment.archived = true));

                db.updateMany(
                    assignments,
                    {},
                    (update_assignments_error, updated_assignments) => {
                        db.find(
                            {
                                type: 'user',
                                flow: { $in: assignment_ids }
                            },
                            { limit: assignment_ids.length },
                            (find_users_error, users: IUser[]) => {
                                users.forEach(
                                    user =>
                                        (user.flow = user.flow.filter(
                                            assignment_id =>
                                                assignment_ids.indexOf(
                                                    assignment_id
                                                ) === -1
                                        ))
                                );

                                db.updateMany(
                                    users,
                                    {},
                                    (update_users_error, updated_users) => {
                                        res.status(200).json([
                                            ...assignments,
                                            ...users
                                        ]);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
}

export default FlowController;
