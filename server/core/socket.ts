import * as SocketIO from 'socket.io';
import * as debug from 'debug';
import * as jwt from 'jwt-simple';
import * as raven from 'raven';
import * as http from 'http';

import db from '../db';

const log_info = debug('lumi:info:core:socket');
const log_error = debug('lumi:error:core:socket');

export default function boot(server: http.Server) {
    log_info('boot start');
    const io = SocketIO(server);

    io.on('connection', (socket: SocketIO.Socket) => {
        log_info('connection');

        try {
            const user = jwt.decode(
                socket.handshake.query.jwt_token,
                process.env.KEY
            );

            socket.on('error', err => {
                log_error(err);
                raven.captureException(err);
            });

            db.changes.on('change', doc => {
                const action = {
                    type: 'DB_CHANGE',
                    payload: [doc]
                };
                if (user.level > 1) {
                    socket.emit('DB_CHANGE', JSON.stringify(action));
                } else {
                    if (
                        user._id === action.payload[0].user_id ||
                        action.payload[0]._id === 'system'
                    ) {
                        socket.emit('DB_CHANGE', JSON.stringify(action));
                    }
                }
            });
        } catch (err) {
            log_error(err);
            raven.captureException(err);
        }
    });

    log_info('boot end');
}
