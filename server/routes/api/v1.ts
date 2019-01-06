import * as express from 'express';
import * as debug from 'debug';
import * as url from 'url';
import * as qs from 'query-string';
import * as proxy from 'express-http-proxy';
import { assign } from 'lodash';
import * as Auth from '../../middleware/auth';

import AuthAPI from '../../api/v1/auth';
import CoreAPI from '../../api/v1/core';

import db from '../../db';

const log_info = debug('lumi:info:api:v1');
const log_error = debug('lumi:error:api:v1');

export default function(): express.Router {
    const router = express.Router();

    const DB = url.parse(process.env.DB);

    router.post('/:db/auth/login', AuthAPI.login);
    // router.post('/:db/auth/register', AuthAPI.register);
    router.get('/:db/auth/username/:username', AuthAPI.username);
    router.get('/:db/core', CoreAPI.get);
    router.post('/:db/core', CoreAPI.post);
    router.delete('/:db/core', Auth.db, Auth.level(4), CoreAPI.delete);

    if (DB.protocol === null) {
        log_info('using pouchdb');
        router.all('*', Auth.db, db.api);
    } else {
        log_info('using couchdb');
        router.all(
            '*',
            Auth.db,
            proxy(process.env.DB, {
                proxyReqPathResolver: proxy_req => {
                    const parts = proxy_req.url.split('?');
                    const query = qs.parse(parts[1]);
                    if (proxy_req.user.level < 3) {
                        assign(query, {
                            filter: '_view',
                            view: 'user/' + proxy_req.user._id
                        });
                    }
                    const queryString = qs.stringify(query);
                    const updatedPath = parts[0];
                    return updatedPath + (queryString ? '?' + queryString : '');
                }
            })
        );
    }

    return router;
}
