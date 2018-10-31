import { exec } from 'child_process';
import * as os from 'os';
import * as debug from 'debug';

const log = debug('lumi:core:host');

export class Host {
    private ip_address: string;
    private error: any;

    constructor() {
        log('entering constructor');
        this.error = undefined;
        this.ip_address = undefined;

        switch (process.env.TARGET) {
            case 'pi':
            default:
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
                break;

            case 'election':
            case 'development':
                this.ip_address = this.get_ip_address();
                console.log(this.ip_address);
                break;
        }
    }

    public get_ip_address(): string {
        const ifaces = os.networkInterfaces();
        let ip: string = '';
        Object.keys(ifaces).forEach(ifname => {
            let alias = 0;

            ifaces[ifname].forEach(iface => {
                if ('IPv4' !== iface.family || iface.internal) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }

                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                } else {
                    // this interface has only one ipv4 adress
                    if (ifname === 'en0') {
                        return (ip = iface.address);
                    }
                }
                ++alias;
            });
        });
        return ip;
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
