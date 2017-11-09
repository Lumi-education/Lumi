import * as express from 'express';
import * as jwt from 'jwt-simple';
import session from '../core/session';

export function auth(
    req: Request,
    res: express.Response,
    next: express.NextFunction
) {
    const jwt_token = req.headers['x-auth'];

    if (jwt_token) {
        try {
            req.user = jwt.decode(jwt_token, process.env.KEY || 'KEY');

            if (
                req.user.session_id !== session.id &&
                req.user.level < userlevel['teacher']
            ) {
                res.status(401).end('session expired');
            } else {
                next();
            }
        } catch (err) {
            res.status(401).end();
        }
    } else {
        res.status(401).end();
    }
}

export function level(
    required_userlevel: 'guest' | 'student' | 'teacher' | 'admin'
): any {
    return (
        req: Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const _required_userlevel: number = userlevel[required_userlevel];
        let user_level = 0;

        if (req.user) {
            user_level = req.user.level;
        }

        if (user_level < _required_userlevel) {
            res.status(401).end('userlevel too low');
        } else {
            next();
        }
    };
}

export enum userlevel {
    guest = 0,
    student = 1,
    teacher = 2,
    admin = 3
}

export interface Request extends express.Request {
    user: {
        _id: string;
        level: number;
        session_id: string;
    };

    doc;
}
