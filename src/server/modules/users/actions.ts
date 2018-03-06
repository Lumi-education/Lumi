import { assign, noop } from 'lodash';
import { DB } from '../../db';
import event from '../../core/event';
import * as bcrypt from 'bcrypt-nodejs';

import { IUser } from 'lib/users/types';
import User from '../../models/User';

export function create_user(
    username: string,
    password: string,
    cb?: (user) => void
) {
    const db = new DB();

    bcrypt.hash(password, null, null, (err, pw) => {
        db.insert(
            new User({
                name: username,
                password: pw
            }),
            res => {
                db.findById(res.body.id, user => {
                    event.emit('USERS/USER_CREATED', user);
                    cb(user);
                });
            }
        );
    });
}
