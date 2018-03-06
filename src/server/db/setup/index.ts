import boot_couchdb from './couchdb/boot';

export default function boot(cb: () => void) {
    boot_couchdb(cb);
}
