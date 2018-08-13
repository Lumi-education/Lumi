import * as _debug from 'debug';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as path from 'path';
import * as fileUpload from 'express-fileupload';
import * as raven from 'raven';
import routes from '../routes';
import H5PView from '../views/h5p';

const log = _debug('lumi:core:app');

export default function boot(): express.Application {
    log('start boot-sequence');
    const app: express.Application = express();

    app.use(raven.requestHandler());
    app.use(raven.errorHandler());

    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'jsx');
    app.engine('jsx', require('express-react-views').createEngine());
    const test = H5PView;

    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
    app.use(
        fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 }
        })
    );

    app.use(compression());

    app.use(routes());

    log('end boot-sequence');

    return app;
}
