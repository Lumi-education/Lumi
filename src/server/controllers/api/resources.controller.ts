import * as express from 'express';
import {assign} from 'lodash';
import {IRequest} from '../../middleware/auth';
import * as fs from 'fs';
import * as path from 'path';
import * as unzip from 'unzip';

export class ResourcesController {
    public find(req : IRequest, res : express.Response) {
        fs.readFile('./srv/' + req.params.id + '/index.json', (err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.end(data);
            }
        });
    }

    public list(req : IRequest, res : express.Response) {
        fs.readdir('./srv', (err, files) => {

            const test = [];

            files.forEach(file => {
                if (file.charAt(0) !== '.' && file.charAt(0) !== '_') {
                    test.push(assign(JSON.parse(fs.readFileSync('./srv/' + file + '/index.json').toString()), {_id: file}))
                }
            })

            res.end(JSON.stringify(test));
        })
    }

    public any(req : IRequest, res : express.Response) {
        const file = './srv/' + req.params[0];
        if (path.extname(file) === '.lumi') {
            fs
                .createReadStream(file)
                .pipe(unzip.Extract({path: 'srv'}))
        } else {
            res.end('not ok')
        }

        // fs.readFile('./srv/' + req.params[0], (err, data) => {     res.json({ err,
        // data: JSON.parse(data.toString())     }); })

    }
}

export default ResourcesController;
