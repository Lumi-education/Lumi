import * as request from 'superagent';

export default function webhook(payload: string) {
    if (process.env.WEBHOOK) {
        request
            .post(process.env.WEBHOOK)
            .send({ text: payload })
            .end();
    }
}
