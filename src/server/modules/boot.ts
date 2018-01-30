import collections from './collections/boot';
import grades from './grades/boot';
import log from './log/boot';

export default function boot() {
    collections();
    grades();
    log();
}