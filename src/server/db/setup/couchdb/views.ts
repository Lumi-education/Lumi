import db from '../..';
import * as debug from 'debug';
import { isEqual } from 'lodash';

const log = debug('db:setup:couchdb:views');

export default function boot(done: () => void) {
    check_view('users', users_view, () => {
        check_view('auth', auth_view, () => {
            check_view('cards', cards_view, () => {
                check_view('tags', tags_view, () => {
                    check_view('activity', activity_view, () => {
                        check_view('comments', comments_view, () => {
                            done();
                        });
                    });
                });
            });
        });
    });
}

function check_view(type: string, _view, done: () => void) {
    db.findById('_design/' + type, (find_view_error, view) => {
        if (find_view_error) {
            log(type + '-view not found -> creating view');
            db.insert(_view, () => {
                log(type + '-view created');
                done();
            });
        }
        if (view) {
            if (isEqual(view.views, _view.views)) {
                log(type + '-view is up to date');
                done();
            } else {
                log(type + '-view is not up to date -> updating');
                db.updateOne('_design/' + type, _view, (err, doc) => {
                    log(type + '-view updated');
                    done();
                });
            }
        }
    });
}

const auth_view = {
    _id: '_design/auth',
    views: {
        login: {
            map:
                'function (doc) {\n  if (doc.type === "user") { emit(doc.name.toLowerCase(), {\n    username: doc.name.toLowerCase(),\n    password: doc.password\n  }); }\n}'
        }
    },
    language: 'javascript'
};

const users_view = {
    _id: '_design/users',
    views: {
        user: {
            map:
                "function (doc) {\n  if (doc.user_id) { \n    emit(doc.user_id, 1); \n    if (doc.type === 'assignment') { emit(doc.user_id, { _id: doc.card_id }) }\n  }\n  if (doc.type === 'user') {\n    emit(doc._id, 1);\n    doc.groups.forEach(function(group_id)  { emit(doc._id, {_id: group_id })} );\n  }\n  if (doc.type === 'comment') {\n    emit(doc.from,1);\n     emit(doc.to, 1);\n  }\n}"
        }
    },
    language: 'javascript'
};

const cards_view = {
    _id: '_design/cards',
    views: {
        index: {
            map:
                'function (doc) {\n  if (doc.type === "card") { \n    emit(doc._id, 1); \n    doc.tags.forEach(function(tag_id) { emit(doc._id, { _id: tag_id })});\n    \n  }\n}'
        }
    },
    language: 'javascript'
};

const tags_view = {
    _id: '_design/tags',
    views: {
        index: {
            map:
                'function (doc) {\n  if (doc.type === "tag") { emit(doc._id, 1); }\n}'
        }
    },
    language: 'javascript'
};

const activity_view = {
    _id: '_design/activity',
    views: {
        index: {
            map:
                "function (doc) {\n  if (doc.type === 'activity') { \n    emit(doc._id, 1); \n    emit(doc._id, { _id: doc.user_id });\n    if (doc.assignment_id) { emit(doc._id, { _id: doc.assignment_id }); }\n  }\n}"
        }
    },
    language: 'javascript'
};

const comments_view = {
    _id: '_design/comments',
    views: {
        all: {
            map:
                "function (doc) {\n  if (doc.type === 'comment') { emit(doc._id, 1); }\n}"
        }
    },
    language: 'javascript'
};
