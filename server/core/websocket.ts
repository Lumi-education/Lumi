import * as jwt from 'jwt-simple';
import * as WebSocket from 'ws';
import * as ChangeStream from 'changes-stream';

export default function boot() {
    const socket = new WebSocket.Server({
        port: process.env.WS_PORT || 8081
    });

    socket.on('connection', (client, req) => {
        try {
            client.user = jwt.decode(
                req.headers['sec-websocket-protocol'],
                process.env.KEY
            );

            const changes = ChangeStream({
                db: process.env.DB_HOST + '/' + process.env.DB,
                include_docs: true,
                since: 'now',
                filter: doc => {
                    if (client.user.level >= 2) {
                        return true;
                    }
                    return doc.user_id === client.user._id;
                }
            });

            changes.on('readable', () => {
                const change = changes.read();
                const msg = {
                    type: 'DB_CHANGE',
                    payload: [change.doc]
                };

                try {
                    client.send(JSON.stringify(msg));
                } catch (err) {
                    console.log(err);
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
}
