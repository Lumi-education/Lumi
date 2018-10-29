import * as express from 'express';
import * as raven from 'raven';

import { assign } from 'lodash';
import { IRequest } from '../../middleware/auth';

import db from '../../db';

import { add_activity } from '../../modules/activity';

export default class CommentsController {
    public create(req: IRequest, res: express.Response) {
        const comment = req.body;
        assign(comment, {
            type: 'comment'
        });
        db.insert(comment, (insert_comment_error, created_comment) => {
            if (insert_comment_error) {
                raven.captureException(insert_comment_error);
                return res.status(400).json(insert_comment_error);
            }

            add_activity(
                created_comment.from,
                'comment',
                new Date(),
                created_comment.ref_id
            );
            res.status(200).json(created_comment);
        });
    }

    public all(req: IRequest, res: express.Response) {
        db.view('comments', 'all', {}, (comments_view_error, comments) => {
            if (comments_view_error) {
                return res.status(400).json(comments_view_error);
            }

            res.status(200).json(comments);
        });
    }

    public comment_seen(req: IRequest, res: express.Response) {
        const comment_ids = req.body.comment_ids;
        const user_id = req.body.user_id;

        db.find(
            {
                _id: { $in: comment_ids }
            },
            { limit: comment_ids.length },
            (find_comments_error, comments) => {
                if (find_comments_error) {
                    raven.captureException(find_comments_error);
                    return res.status(400).json(find_comments_error);
                }
                comments.forEach(comment => comment.seen_by.push(user_id));

                db.updateMany(comments, {}, (err, docs) => {
                    res.status(200).json(comments);
                });
            }
        );
    }
}
