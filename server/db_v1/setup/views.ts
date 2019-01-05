const views = [
    {
        _id: '_design/auth',
        views: {
            login: {
                map:
                    'function (doc) {\n  if (doc.type === "user") { emit(doc.name.toLowerCase(), {\n    username: doc.name.toLowerCase(),\n    password: doc.password\n  }); }\n}'
            },
            username: {
                map:
                    'function (doc) {\n  if (doc.type === "user") { emit(doc.name, 1) }\n}'
            }
        },
        language: 'javascript'
    },
    {
        _id: '_design/users',
        views: {
            init: {
                map:
                    "function (doc) {\n  if (doc.user_id) { \n    emit(doc.user_id, 1); \n    if (doc.type === 'assignment') { emit(doc.user_id, { _id: doc.card_id }) }\n  }\n  if (doc.type === 'user') {\n    emit(doc._id, 1);\n    doc.groups.forEach(function(group_id)  { emit(doc._id, {_id: group_id })} );\n  }\n  if (doc.type === 'comment') {\n    emit(doc.from,1);\n     emit(doc.to, 1);\n  }\n}"
            },
            user: {
                map:
                    "function (doc) {\n  if (doc.type === 'user') { emit(doc._id, 1); }\n}"
            }
        },
        language: 'javascript'
    },
    {
        _id: '_design/user',
        views: {
            admin: {
                map: 'function (doc) {\n  emit(doc._id); \n}'
            }
        },
        language: 'javascript'
    },
    {
        _id: '_design/cards',
        views: {
            index: {
                map:
                    'function (doc) {\n  if (doc.type === "card" || doc.type === "tag") { \n    emit(doc._id, 1);    \n  }\n}'
            }
        },
        language: 'javascript'
    },
    {
        _id: '_design/tags',
        views: {
            index: {
                map:
                    'function (doc) {\n  if (doc.type === "tag") { emit(doc._id, 1); }\n}'
            }
        },
        language: 'javascript'
    },
    {
        _id: '_design/activity',
        views: {
            index: {
                map:
                    "function (doc) {\n  if (doc.type === 'activity') { \n    emit(doc._id, 1); \n    emit(doc._id, { _id: doc.user_id });\n    if (doc.assignment_id) { emit(doc._id, { _id: doc.assignment_id }); }\n  }\n}"
            }
        },
        language: 'javascript'
    },
    {
        _id: '_design/comments',
        views: {
            all: {
                map:
                    "function (doc) {\n  if (doc.type === 'comment') { emit(doc._id, 1); }\n}"
            }
        },
        language: 'javascript'
    },
    {
        _id: '_design/flow',
        views: {
            assignments: {
                map:
                    "function (doc) {\n  if (doc.type === 'assignment') { \n    emit(doc._id, 1); \n    emit(doc._id, { _id: doc.card_id });\n  }\n}"
            }
        },
        language: 'javascript'
    },
    {
        _id: '_design/groups',
        views: {
            autojoin: {
                map:
                    "function (doc) {\n  if (doc.type === 'group') { \n    if (doc.autojoin) {\n          emit(doc._id, 1); \n\n    }\n    \n  }\n}"
            }
        },
        language: 'javascript'
    }
];

export default views;
