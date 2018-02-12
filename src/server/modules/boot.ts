import collections from './collections/boot';
import grades from './grades/boot';
import cards from './cards/boot';
import log from './log/boot';

export default function boot() {
    cards();
    collections();
    grades();
    log();
}
