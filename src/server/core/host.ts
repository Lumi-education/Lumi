import { exec } from 'child_process';

import * as debug from 'debug';

const log = debug('lumi:core:host');

export class Host {
    private ip_address: string;
    private error: any;

    constructor() {
        log('entering constructor');
        this.error = undefined;
        this.ip_address = undefined;

        exec(
            "/sbin/ip route|awk '/default/ { print $3 }'",
            (ip_error, ip_stdout, ip_stderr) => {
                if (ip_error || ip_stderr !== '') {
                    log('HOST_IP_ADDRESS_ERROR', ip_error || ip_stderr);
                    return (this.error = ip_error || ip_stderr);
                }
                const host_ip_address = ip_stdout.replace(/\n/g, '');

                this.ip_address = host_ip_address;
                log('HOST_IP_ADDRESS_SUCCESS', this.ip_address);
            }
        );
    }

    public exec(cmd: string, cb: (error, message) => void) {
        if (this.error || !this.ip_address) {
            log('EXEC_ERROR', this.error);
            return cb(this.error || 'host ip-address unknown', undefined);
        }
        exec(
            "ssh -i /srv/lumi_sshkey -o 'StrictHostKeyChecking no' pi@" +
                this.ip_address +
                " '" +
                cmd +
                "'",
            (cmd_error, cmd_stdout, cmd_stderr) => {
                if (cmd_error || cmd_stderr) {
                    log('EXEC_ERROR', cmd_error || cmd_stderr);
                    return cb(cmd_error || cmd_stderr, undefined);
                }
                log('EXEC_SUCCESS', cmd_stdout);

                cb(null, cmd_stdout);
            }
        );
    }
}

export default new Host();
