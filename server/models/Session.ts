import { assign } from 'lodash';
import { ISession, User_id } from 'lib/types';

import User from './User';

import { DB, Relations } from '../db';

export default class Session extends Relations implements ISession {
    public _id: string;
    public user_id: User_id;
    public type: 'session';
    public online: boolean;

    constructor(t?: Session) {
        super();
        if (t) {
            return assign(
                this,
                {
                    type: 'session',
                    online: false
                },
                t
            );
        } else {
            this._id = undefined;
            this.user_id = undefined;
            this.type = 'session';
            this.online = false;
            return this;
        }
    }

    get_user(db: DB, cb: (user: User) => void) {
        this.hasOne(db, this.user_id, cb, User);
    }
}
