import * as nano from 'nano';

const _nano = nano( process.env.DB_HOST || 'http://localhost:5984');

export default _nano.db.use( process.env.DB || 'lumidb');