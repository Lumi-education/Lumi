import boot_couchdb from './couchdb/boot';
import migrate from './migration';

export default function boot(done: () => void) {
    boot_couchdb(() => {
        migrate(() => {
            done();
        });
    });
}
