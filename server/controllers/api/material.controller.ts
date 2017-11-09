import * as express from 'express';
import proxy from '../../core/proxy';

export function attachment(req: express.Request, res: express.Response) {
    req.url = req.url.replace('/material', '/' + process.env.DB);

    proxy.web(req, res, {
        target: process.env.DB_HOST
            ? process.env.DB_HOST
            : 'http://127.0.0.1:5984'
    });
}
