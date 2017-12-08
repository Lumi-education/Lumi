import * as express from 'express';
import { assign, noop } from 'lodash';

import { DB } from 'server/db';

class InstallController {
    private _status: {
        is_installed: boolean;
    };

    // constructor() {
    //     const db = new DB(null, null);

    //     db.findOne({ type: 'status' }, {}, status => {
    //         if (status) {
    //             this._status = status;
    //         } else {
    //             this._status = {
    //                 is_installed: false
    //             };
    //         }
    //     });

    //     this.install = this.install.bind(this);
    // }

    public install(req: express.Request, res: express.Response) {
        res.status(200).json(this._status);
    }
}

export default new InstallController();
