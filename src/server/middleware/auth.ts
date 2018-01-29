import * as express from 'express';
import * as jwt from 'jwt-simple';
import * as raven from 'raven';
import { noop } from 'lodash';
import { DB } from '../db';

export function auth(
    req: IRequest,
    res: express.Response,
    next: express.NextFunction
) {
    const jwtToken = req.headers['x-auth'];

    if (jwtToken) {
        try {
            req.user = jwt.decode(jwtToken, process.env.KEY || 'KEY');
            if (!req.user.db || req.user.db !== req.params.db) {
                throw new Error('no db');
            }

            raven.setContext({ user: req.user });

            next();
        } catch (err) {
            raven.captureException(err);
            res.status(401).end();
        }
    } else {
        res.status(401).end();
    }
}

export function level(userLevel: number): any {
    return (
        req: IRequest,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            if (req.user.level < userLevel) {
                res.status(401).end('userlevel too low');
            } else {
                next();
            }
        } catch (err) {
            res.status(500).end(JSON.stringify(err));
        }
    };
}

// 0 unauthed
// 1 guest
// 2 user
// 3 admin

export interface IRequest extends express.Request {
    user: {
        _id: string;
        level: number;
        groups: string[];
        db: string;
        session_id: string;
    };

    doc;
}
