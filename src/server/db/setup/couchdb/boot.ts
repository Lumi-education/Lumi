import * as _debug from 'debug';
import * as superagent from 'superagent';
import * as raven from 'raven';

import { ISystemSettings } from '../../../../../lib/core/types';
import { IUser } from '../../../../../lib/users/types';

import boot_views from './views';

import db from '../..';

const debug = _debug('lumi:db:setup');

const _system: ISystemSettings = {
    _id: 'system',
    changes_port: process.env.CHANGES_PORT
};

const _admin: IUser = {
    _id: 'admin',
    _deleted: false,
    type: 'user',
    name: 'admin',
    level: 4,
    groups: [],
    last_active: new Date(),
    last_login: new Date(),
    online: false,
    location: '',
    password: undefined,
    flow: []
};

export default function(done: () => void) {
    debug('check for db: ' + process.env.DB);
    superagent
        .get(process.env.DB_HOST + '/' + process.env.DB)
        .then(res => {
            debug(process.env.DB + ': OK');
            // boot_views(() => done());
            boot();
            done();
        })
        .catch(err => {
            if (err.status === 404) {
                debug(process.env.DB + ': not OK');

                debug('creating db ' + process.env.DB);

                superagent
                    .put(process.env.DB_HOST + '/' + process.env.DB)
                    .then(res => {
                        debug(process.env.DB + ': created');
                        boot();
                        done();
                    })
                    .catch(error => {
                        debug('ERROR: ', error);
                    });
            }
            raven.captureException(err);
        });
}

function boot() {
    db.findById('system', (find_system_error, system) => {
        if (find_system_error || !system._id) {
            db.insert(_system);
        }
    });

    db.findById('admin', (find_admin_error, admin) => {
        if (find_admin_error || !admin._id) {
            db.insert(_admin);
        }
    });
}
