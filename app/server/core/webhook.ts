import * as request from 'superagent';
import * as os from 'os';

export default function webhook(payload) {
    if (process.env.WEBHOOK) {
        payload.username = payload.username + ' @' + os.hostname();

        request
            .post(process.env.WEBHOOK)
            .send(payload)
            .end();
    }
}