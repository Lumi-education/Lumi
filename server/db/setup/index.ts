import init from './init';

export default function boot(done: () => void) {
    init(() => {
        done();
    });
}
