import grades from './grades/boot';
import cards from './cards/boot';
import log from './log/boot';
import groups from './groups/boot';

export default function boot() {
    cards();
    grades();
    groups();
    log();
}
