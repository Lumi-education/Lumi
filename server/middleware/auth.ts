import * as express from 'express';
import * as jwt from 'jwt-simple';
import * as raven from 'raven';
import ErrorResponse from '../core/error';

export function auth(
    req: IRequest,
    res: express.Response,
    next: express.NextFunction
) {
    const jwtToken = req.headers['x-auth'];

    if (jwtToken) {
        try {
            req.user = jwt.decode(jwtToken, process.env.KEY || 'KEY');
            raven.setContext({ user: req.user });

            next();
        } catch (err) {
            raven.captureException(err);
            res.status(401).end();
        }
    } else {
        req.user = undefined;
        next();
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

export function db(
    req: IRequest,
    res: express.Response,
    next: express.NextFunction
) {
    if (!req.user) {
        return res
            .status(401)
            .json(
                new ErrorResponse('auth', 'InvalidUser', 'auth.invalid_user')
            );
    }

    if (!req.user.db) {
        return res
            .status(404)
            .json(new ErrorResponse('auth', 'InvalidDB', 'auth.invalid_db'));
    }

    const _db = req.path.split('/')[1];

    if (req.user.db !== _db && _db !== '') {
        return res
            .status(401)
            .json(new ErrorResponse('auth', 'InvalidDB', 'auth.invalid_db'));
    }
    next();
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
