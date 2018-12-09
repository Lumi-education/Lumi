import init from './init';
import migrate from './migration';

export default function boot(done: () => void) {
    init(() => {
        // migrate(() => {
        done();
        // });
    });
}
