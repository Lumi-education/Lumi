import * as express from 'express';
import { assign } from 'lodash';

import * as Auth from '../auth';

export function restrict_view(
    req: Auth.IRequest,
    res: express.Response,
    next: express.NextFunction
) {
    const query = req.query;
    if (req.user.level < 3) {
        assign(query, {
            filter: '_view',
            view: 'user/' + req.user._id
        });
    } else {
        assign(query, {
            filter: '_view',
            view: 'user/admin'
        });
    }
    req.query = query;
    next();
}
