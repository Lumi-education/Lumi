import * as SocketIO from 'socket.io';
import * as debug from 'debug';
import * as jwt from 'jwt-simple';
import * as raven from 'raven';

import db from '../db';

const log = debug('lumi:core:socket');

export default function boot(server) {
    const io = SocketIO(server);

    io.on('connection', (socket: SocketIO.Socket) => {
        log('connection', socket);

        try {
            const user = jwt.decode(
                socket.handshake.query.jwt_token,
                process.env.KEY
            );

            socket.on('error', err => {
                raven.captureException(err);
            });

            db.changes.on('change', msg => {
                if (user.level > 1) {
                    socket.emit('DB_CHANGE', JSON.stringify(msg));
                } else {
                    if (
                        user._id === msg.payload[0].user_id ||
                        msg.payload[0]._id === 'system'
                    ) {
                        socket.emit('DB_CHANGE', JSON.stringify(msg));
                    }
                }
            });
        } catch (err) {
            raven.captureException(err);
        }
    });
}
