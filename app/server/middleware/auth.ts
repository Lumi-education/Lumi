import * as express from 'express';
import * as jwt from 'jwt-simple';

export function auth(
    req: IRequest,
    res: express.Response,
    next: express.NextFunction
) {
    const jwtToken = req.headers['x-auth'];

    if (jwtToken) {
        try {
            req.user = jwt.decode(jwtToken, process.env.KEY || 'KEY');

            next();
        } catch (err) {
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

export interface IRequest extends express.Request {
    user: {
        _id: string;
        level: number;
        groups: string[];
        session_id: string;
    };

    doc;
}
