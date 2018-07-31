import {DB} from '../../';
import * as debug from 'debug';
import {isEqual} from 'lodash';

const log = debug('db:setup:couchdb:views');

export default function boot(cb: () => void) {
    check_view('auth', auth_view);
    check_view('card', card_view);
    check_view('collection', collection_view);
    check_view('data', data_view);
    check_view('grade', grade_view);
    check_view('group', group_view);
    check_view('tag', tag_view);
    check_view('user', user_view);
    cb();
}

function check_view(type: string, _view) {
    const _db = new DB();
    _db.checkView('_design/' + type, view => {
        if (!view) {
            log(type + '-view not found -> creating view');
            _db.insert(_view, () => {
                log(type + '-view created');
            });
        }
        if (view) {
            if (isEqual(view.views, _view.views)) {
                log(type + '-view is up to date');
            } else {
                log(type + '-view is not up to date -> updating');
                _db.updateOne('_design/' + type, _view, (err, doc) => {
                    log(type + '-view updated');
                });
            }
        }
    });
}

const auth_view = {
    _id: '_design/auth',
    views: {
        check_username: {
            map:
                'function (doc) {\n  if (doc.type === "user") { emit(doc.name, {\n    username: doc.name,\n    password: doc.password\n  }); }\n}'
        }
    },
    language: 'javascript'
};

const card_view = {
    _id: '_design/card',
    views: {
        list: {
            map:
                "function (doc) {\n  if (doc.type === 'card') { emit(doc._id, 1); }\n}"
        }
    },
    language: 'javascript'
};

const collection_view = {
    _id: '_design/collection',
    views: {
        with_cards: {
            map:
                "function (doc) {\n  if (doc.type == 'collection') {\n    emit(doc._id, 1);\n    for (var i in doc.cards) {\n      emit(doc._id, { _id: doc.cards[i] });\n    }\n  }\n  \n}"
        },
        by_group: {
            map:
                "function (doc) {\n  if (doc.type === 'group') {\n    doc.assigned_collections.forEach(function(collection_id) {\n      emit(doc._id, { _id: collection_id });\n    })\n  }\n}"
        },
        for_user: {
            map:
                "function (doc) {\n  if (doc.data_type === 'collection') { \n    emit(doc.user_id, 1); \n    emit(doc.user_id, {_id: doc.collection_id});\n  }\n}"
        },
        list: {
            map:
                "function (doc) {\n  if (doc.type === 'collection') { emit(doc._id, 1); }\n}"
        }
    },
    language: 'javascript'
};

const data_view = {
    _id: '_design/data',
    views: {
        for_user: {
            map:
                "function (doc) {\n  if (doc.type === 'data') { \n  emit(doc.user_id, 1);\n  }\n}"
        },
        for_user_and_collection: {
            map:
                "function (doc) {\n  if (doc.type === 'data') { \n  emit(doc.user_id+doc.collection_id, 1);\n  }\n}"
        },
        for_user_and_collection_and_card: {
            map:
                "function (doc) {\n  if (doc.type === 'data') { \n  emit(doc.user_id+doc.collection_id+doc.card_id, 1);\n  }\n}"
        }
    },
    language: 'javascript'
};

const grade_view = {
    _id: '_design/grade',
    views: {
        user: {
            map:
                "function (doc) {\n  if (doc.type === 'grade') { \n  emit(doc.user_id, 1);\n  }\n}"
        }
    },
    language: 'javascript'
};

const group_view = {
    _id: '_design/group',
    views: {
        for_user: {
            map:
                'function (doc) {\n  if (doc.type === "group_ref") { \n    emit(doc.user_id, 1);\n    doc.groups.forEach(function(group_id) { emit(doc.user_id, { _id: group_id}); })\n  }\n}'
        },
        list: {
            map:
                'function (doc) {\n  if (doc.type === "group") { emit(doc._id, 1); }\n}'
        },
        with_collections_and_users: {
            map:
                'function (doc) {\n  if (doc.type === "group") {\n    emit(doc._id, 1);\n    doc.assigned_collections.forEach(function(collection_id) {\n      emit(doc._id, { _id: collection_id });\n    });\n  }\n  if (doc.type === "group_ref") {\n    doc.groups.forEach(function(group_id) { emit(group_id, { _id: doc._id })});\n  }\n}'
        },
        user: {
            map:
                "function (doc) {\n  if (doc.type === 'group_ref') { \n    doc.groups.forEach(function(group_id) { emit(group_id, { _id: doc.user_id }); });\n}\n}"
        }
    },
    language: 'javascript'
};

const tag_view = {
    _id: '_design/tag',
    views: {
        by_doc: {
            map:
                "function (doc) {\n  if (doc.type === 'tag_ref') { \n    doc.tags.forEach(function (tag_id) { emit(doc.doc_id, { _id: tag_id }); });\n    emit(doc.doc_id, 1);\n  }\n}"
        },
        tag_with_docs: {
            map:
                "function (doc) {\n  if (doc.type === 'tag') { emit(doc._id, 1); }\n  if (doc.type === 'tag_ref') { emit(doc.tag_id, { _id: doc.doc_id }); }\n}"
        },
        index: {
            map:
                "function (doc) {\n  if (doc.type === 'tag' || doc.type === 'tag_ref') { emit(doc._id, 1); }\n}"
        },
        indexRef: {
            map:
                "function (doc) {\n  if (doc.type === 'tag_ref') { emit(doc._id, 1); }\n}"
        }
    },
    language: 'javascript'
};

const user_view = {
    _id: '_design/user',
    views: {
        with_groups: {
            map:
                'function (doc) {\n  if (doc.type === "user") { \n    emit(doc._id, 1);\n    doc.groups.forEach(function(group_id) {\n      emit(doc._id, {_id: group_id});\n    })\n  }\n}'
        },
        list: {
            map:
                'function (doc) {\n  if (doc.type === "user") { emit(doc._id, 1); }\n}'
        },
        init: {
            map:
                'function (doc) {\n  if (doc.user_id) { emit(doc.user_id, 1); }\n}'
        }
    },
    language: 'javascript'
};
