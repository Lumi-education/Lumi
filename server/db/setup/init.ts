import * as _debug from 'debug';
import * as url from 'url';
import * as superagent from 'superagent';
import * as raven from 'raven';

import { ISystemSettings } from 'lib/core/types';
import { IUser } from 'lib/users/types';

import boot_views from './views';

import db from '..';

const debug = _debug('lumi:db:setup:init');

const _system: ISystemSettings = {
    _id: 'system',
    mode: 'free',
    controlled_location: '/user',
    allow_user_registration: true,
    provide_password: false,
    ip: undefined,
    port: undefined,
    target: undefined,
    installed: false
};

const _admin: IUser = {
    _id: 'admin',
    _rev: undefined,
    _deleted: false,
    type: 'user',
    name: 'admin',
    level: 4,
    groups: [],
    password: undefined,
    flow: [],
    _attachments: {}
};

export default function init(done: () => void) {
    const DB = url.parse(process.env.DB);
    if (DB.protocol === null) {
        boot();
        boot_views(() => {
            done();
        });
    } else {
        debug('check for db: ' + DB.pathname);
        superagent
            .get(DB.href)
            .then(res => {
                debug(DB.pathname + ': OK');
                boot();
                boot_views(() => {
                    done();
                });
            })
            .catch(err => {
                if (err.status === 404) {
                    debug(DB.pathname + ': not OK');

                    debug('creating db ' + DB.pathname);

                    superagent
                        .put(DB.href)
                        .then(res => {
                            debug(DB.pathname + ': created');
                            boot();
                            boot_views(() => done());
                        })
                        .catch(error => {
                            debug('ERROR: ', error);
                        });
                }
                raven.captureException(err);
            });
    }
}

function boot() {
    db.findById('system', (find_system_error, system) => {
        if (find_system_error || !system._id) {
            db.insert(_system, (error, docs) => {
                debug('system created');
            });
        }
    });

    db.findById('admin', (find_admin_error, admin) => {
        if (find_admin_error || !admin._id) {
            db.insert(_admin, (error, doc) => {
                debug('admin created');
            });
        }
    });
}
