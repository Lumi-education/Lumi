import* as debug from 'debug';
import wait_for_couchdb from './utils/wait_for_couchdb';

var log = debug('boot');

log('loading boot-files');
import boot from './core/boot';

boot();