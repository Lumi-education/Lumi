import * as express from 'express';
import {assign} from 'lodash';
import {IRequest} from '../../middleware/auth';

import db from '../../db';

import {IAssignment} from 'lib/flow/types';

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

    public delete_assignment(req: IRequest, res: express.Response) {
        db.find(
            {
                type: 'assignment',
                assignment_id: req.body.assignment_id
            },
            {},
            (error, assignments: IAssignment[]) => {
                assignments.forEach(assignment => {
                    db.delete(assignment._id);
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
                if (!assignment.data) {
                    assignment.data = [];
                }
                assignment.data.push(req.body);
                assignment.completed = true;

                db.updateOne(req.params.assignment_id, assignment, (err, a) => {
                    res.status(200).end();
                });
            }
        );
    }

    public get_state(req: IRequest, res: express.Response) {
        db.findById(
            req.params.assignment_id,
            (error, assignment: IAssignment) => {
                res.status(200).json(assign(assignment.state, {success: true}));
            }
        );
    }

    public assign(req: IRequest, res: express.Response) {
        // required params: user_id[] && card_id[] && group_id

        if (!req.body.group_id || !req.body.user_ids || !req.body.card_ids) {
            return res.status(400).json({message: 'invalid body'});
        }

        const group_id = req.body.group_id;

        const _assignments: IAssignment[] = [];

        req.body.card_ids.forEach(card_id => {
            req.body.user_ids.forEach(user_id => {
                const _assignment: IAssignment = {
                    user_id,
                    card_id,
                    type: 'assignment',
                    group_id: req.body.group_id,
                    completed: false,
                    data: null,
                    score: null,
                    state: null,
                    time: null
                };

                _assignments.push(_assignment);
            });
        });

        db.insertMany(_assignments, {}, (err, result) => {
            _assignments.map((a, i) => {
                return assign(a, {_id: result[i].id});
            });

            db.find(
                {
                    _id: {
                        $in: req.body.user_ids
                    }
                },
                {
                    limit: 32
                },
                users => {
                    users.map(user => {
                        user.flow[group_id] = [
                            ...user.flow[group_id],
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
}

export default FlowController;
