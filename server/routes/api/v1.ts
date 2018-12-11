import * as express from 'express';
import * as debug from 'debug';
import * as url from 'url';

import * as proxy from 'express-http-proxy';

import * as Auth from '../../middleware/auth';

import db from '../../db';

const log_info = debug('lumi:info:api:v1');
const log_error = debug('lumi:error:api:v1');

export default function(): express.Router {
    const router = express.Router();

    const DB = url.parse(process.env.DB);

    if (DB.protocol === null) {
        log_info('using pouchdb');
        router.all(
            '*',
            (
                req: Auth.IRequest,
                res: express.Response,
                next: express.NextFunction
            ) => {
                if (!req.user) {
                    return res.status(401).json({ message: 'auth_required' });
                }
                next();
            },
            db.api
        );
    } else {
        log_info('using couchdb');
        router.all(
            '*',
            (
                req: Auth.IRequest,
                res: express.Response,
                next: express.NextFunction
            ) => {
                if (!req.user) {
                    return res.status(401).json({ message: 'auth_required' });
                }
                next();
            },
            proxy(process.env.DB, {
                proxyReqPathResolver: proxy_req => {
                    const parts = proxy_req.url.split('?');
                    const queryString = parts[1]
                        ? parts[1].replace(
                              'user%2Fme',
                              'user%2F' + proxy_req.user._id
                          )
                        : undefined;
                    const updatedPath = parts[0];
                    return updatedPath + (queryString ? '?' + queryString : '');
                }
            })
        );
    }

    return router;
}
