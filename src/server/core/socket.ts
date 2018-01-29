import * as SocketIO from 'socket.io';
import * as express from 'express';
import * as debug from 'debug';
import * as ChangeStream from 'changes-stream';
import * as jwt from 'jwt-simple';
import * as raven from 'raven';

const log = debug('lumi:socket');

export default function boot(server) {
    const io = SocketIO(server);

    io.on('connection', (socket: SocketIO.Socket) => {
        log('connection', socket);

        socket.on('error', raven.captureException);

        try {
            const user = jwt.decode(
                socket.handshake.query.jwt_token,
                process.env.KEY
            );

            const changes = ChangeStream({
                db: process.env.DB_HOST + '/' + user.db,
                include_docs: true,
                since: 'now',
                filter: doc => {
                    if (user.level >= 2) {
                        return true;
                    }
                    return doc.user_id === user._id;
                }
            });

            changes.on('error', err => {
                raven.captureException(err);
            });

            changes._onError(raven.captureException);

            changes.on('readable', () => {
                const change = changes.read();
                const msg = {
                    type: 'DB_CHANGE',
                    payload: [change.doc]
                };

                try {
                    socket.emit('DB_CHANGE', JSON.stringify(msg));
                } catch (err) {
                    raven.captureException(err);
                }
            });
        } catch (err) {
            raven.captureException(err);
        }
    });
}
