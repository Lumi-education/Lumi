import * as debug from 'debug';

var log = debug('boot');

log('loading boot-files');
import boot from './core/boot';

boot();