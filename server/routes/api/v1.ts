import * as express from 'express';
import * as debug from 'debug';
import * as url from 'url';
import * as qs from 'query-string';
import * as proxy from 'express-http-proxy';
import { assign } from 'lodash';
import mw from '../../middleware';
import * as raven from 'raven';
import AuthAPI from '../../controller/auth';
import CoreAPI from '../../controller/core';
import MaterialAPI from '../../controller/material';
import FlowAPI from '../../controller/flow';
import DB from '../../db';

const log_info = debug('lumi:info:api:v1');
const log_error = debug('lumi:error:api:v1');

export default function(): express.Router {
    const router = express.Router();

    const _DB = url.parse(process.env.DB);

    router.post('/:db/auth/login', AuthAPI.login);
    // router.post('/:db/auth/register', mw.authAPI.register);
    router.get('/:db/auth/username/:username', AuthAPI.username);
    router.get('/:db/core', CoreAPI.get);
    router.post('/:db/core', CoreAPI.post);
    router.delete('/:db/core', mw.auth.db, mw.auth.level(4), CoreAPI.delete);
    router.post(
        '/:db/material',
        mw.auth.db,
        mw.auth.level(4),
        MaterialAPI.create_material
    );
    router.delete(
        '/:db/material/:material_id',
        mw.auth.db,
        mw.auth.level(4),
        MaterialAPI.delete_material
    );
    router.get('/:db/material', MaterialAPI.read_material);
    router.get(
        '/:db/material/:id/attachment/:attachment',
        MaterialAPI.get_attachment
    );

    router.put(
        '/:db/material/:material_id',
        mw.auth.db,
        mw.auth.level(4),
        MaterialAPI.update_material
    );

    router.post('/:db/material/find', MaterialAPI.find);

    router.get('/:db/flow/assignment/:assignment_id/state', FlowAPI.get_state);
    router.post(
        '/:db/flow/assignment/:assignment_id/state',
        FlowAPI.save_state
    );
    router.post('/:db/flow/assignment/:assignment_id/data', FlowAPI.save_data);

    if (_DB.protocol === null) {
        log_info('using pouchdb');
        router.all(
            '*',
            mw.auth.db,
            mw.db.pouchdb.restrict_view,
            new DB('lumi').api
        );
    } else {
        log_info('using couchdb');
        router.all(
            '*',
            mw.auth.db,
            proxy(process.env.DB, {
                proxyReqPathResolver: proxy_req => {
                    try {
                        const parts = proxy_req.url.split('?');
                        const query = qs.parse(parts[1]);
                        if (proxy_req.user.level < 3) {
                            assign(query, {
                                filter: '_view',
                                view: 'user/' + proxy_req.user._id
                            });
                        } else {
                            assign(query, {
                                filter: '_view',
                                view: 'user/admin'
                            });
                        }
                        const queryString = qs.stringify(query);
                        const updatedPath = parts[0];
                        return (
                            updatedPath + (queryString ? '?' + queryString : '')
                        );
                    } catch (error) {
                        raven.captureException(error);
                    }
                }
            })
        );
    }

    return router;
}
