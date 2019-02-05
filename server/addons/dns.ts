import * as dns from 'native-dns';
import * as debug from 'debug';

import host from './host';

const log_info = debug('lumi:info:dns');
const log_error = debug('lumi:error:dns');

const server: any = dns.createServer();

export default function boot() {
    server.on('listening', () => {
        log_info('server listening on', server.address());
    });
    server.on('close', () => {
        log_info('server closed', server.address());
    });
    server.on('error', (err, buff, req, res) => {
        console.error(err.stack);
    });
    server.on('socketError', (err, socket) => {
        console.error(err);
    });

    const authority = { address: '8.8.8.8', port: 53, type: 'udp' };

    function proxy(question, response, cb) {
        log_info('proxying', question.name);

        const request: any = dns.Request({
            question, // forwarding the question
            server: authority, // this is the DNS server we are asking
            timeout: 1000
        });

        // when we get answers, append them to the response
        request.on('message', (err, msg) => {
            msg.answer.forEach(a => {
                response.answer.push(a);
            });
        });

        request.on('end', cb);
        request.send();
    }

    const async = require('async');

    // const entries = [
    //   { domain: "^lise.*", records: [ { type: "A", address: "192.168.178.2", ttl: 1800 } ] },
    //   { domain: "^hello.peteris.*", records: [ { type: "A", address: "127.0.0.99", ttl: 1800 } ] },
    //   { domain: "^cname.peteris.*", records: [ { type: "CNAME", address: "hello.peteris.rocks", ttl: 1800 } ] }
    // ];

    function handleRequest(request, response) {
        log_info(
            'request from',
            request.address.address,
            'for',
            request.question[0].name
        );

        const f = [];

        request.question.forEach(question => {
            // const entry = entries.filter(function(r){  new RegExp(r.domain, 'i').exec(question.name) });
            const entry = [
                {
                    domain: '*',
                    records: [
                        { type: 'A', address: host.get_ip_address(), ttl: 1800 }
                    ]
                }
            ]; // : [];
            if (entry.length) {
                entry[0].records.forEach((record: any) => {
                    record.name = question.name;
                    record.ttl = record.ttl || 1800;
                    if (record.type === 'CNAME') {
                        record.data = record.address;
                        f.push(cb => {
                            proxy(
                                {
                                    name: record.data,
                                    type: dns.consts.NAME_TO_QTYPE.A,
                                    class: 1
                                },
                                response,
                                cb
                            );
                        });
                    }
                    response.answer.push(dns[record.type](record));
                });
            } else {
                f.push(cb => {
                    proxy(question, response, cb);
                });
            }
        });

        async.parallel(f, () => {
            response.send();
        });
    }

    server.on('request', handleRequest);

    server.serve(53);
}
