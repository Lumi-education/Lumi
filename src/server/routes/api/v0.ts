import * as express from 'express';
import * as debug from 'debug';
import * as path from 'path';

import mw from '../../middleware';

import AuthController from '../../controllers/api/auth.controller';
import CardsController from '../../controllers/api/cards.controller';
import GroupController from '../../controllers/api/groups.controller';
import UsersController from '../../controllers/api/users.controller';
import TagsController from '../../controllers/api/tags.controller';
import CoreController from '../../controllers/api/core.controller';
import FlowController from '../../controllers/api/flow.controller';
import ActivityController from '../../controllers/api/activity.controller';

const log = debug('lumi:routes:api');

export default function(): express.Router {
    log('start boot-sequence');
    const router = express.Router();

    const authController = new AuthController();
    const cardsController = new CardsController();
    const groupController = new GroupController();
    const usersController = new UsersController();
    const tagsController = new TagsController();
    const coreController = new CoreController();
    const flowController = new FlowController();
    const activityController = new ActivityController();

    router.post('/flow/assign', mw.auth, mw.level(3), flowController.assign);
    router.get(
        '/flow/assignments',
        mw.auth,
        mw.level(1),
        flowController.get_assignments
    );
    router.delete(
        '/flow/assignments',
        mw.auth,
        mw.level(3),
        flowController.delete_assignments
    );
    router.get(
        '/flow/assignment/:assignment_id/state',
        flowController.get_state
    );
    router.post(
        '/flow/assignment/:assignment_id/state',
        flowController.save_state
    );

    router.post(
        '/flow/assignment/:assignment_id/data',
        flowController.save_data
    );

    router.put('/flow/assignments', mw.auth, flowController.update_assignments);
    router.post(
        '/flow/assignments/archive',
        mw.auth,
        mw.level(0),
        flowController.archive_assignments
    );

    router.post(
        '/flow/assignments/sync',
        mw.auth,
        mw.level(0),
        flowController.sync_assignments
    );

    router.post('/core/find', mw.auth, mw.level(3), coreController.find);
    router.post('/core/update', mw.auth, mw.level(3), coreController.update);
    router.get('/core/ping', coreController.ping);

    router.post('/core/upload', mw.auth, mw.level(0), coreController.upload);
    router.get(
        '/core/upload',
        mw.auth,
        mw.level(0),
        express.static(path.resolve('build/upload'))
    );

    router.post(
        '/system/shutdown',
        mw.auth,
        mw.level(3),
        coreController.shutdown
    );
    router.get('/system/settings', coreController.settings);

    // mw.auth
    router.post('/auth/login', authController.login);
    router.post('/auth/register', authController.register);
    router.post('/auth/logout', mw.auth, authController.logout);
    router.get('/user/auth/session', mw.auth, authController.get_session);
    router.get('/auth/username/:username', authController.username);
    router.post('/auth/password', authController.set_password);

    // cards
    router.get('/cards', mw.auth, mw.level(1), cardsController.list);
    router.post('/cards', mw.auth, mw.level(1), cardsController.create);
    router.get('/cards/:id', mw.auth, mw.level(1), cardsController.read);
    router.put('/cards/:id', mw.auth, mw.level(3), cardsController.update);
    router.delete('/cards/:id', mw.auth, mw.level(3), cardsController.delete);
    router.post(
        '/cards/:id/duplicate',
        mw.auth,
        mw.level(3),
        cardsController.duplicate
    );

    router.use('/h5pcontent/content/:h5pfile/*', (req, res) => {
        const file = path.join(
            path.resolve('build/h5p'),
            req.params.h5pfile,
            'content',
            req.params[0]
        );
        res.sendfile(file);
    });
    router.get('/h5p/:content_id', cardsController.h5p);
    router.use('/h5plib', express.static(path.resolve('build/h5p')));

    router.post('/h5p', mw.auth, mw.level(1), cardsController.h5p_upload);

    // cards -> attachments
    router.all(
        '/cards/:id/attachment/:attachment',
        mw.auth,
        mw.level(2),
        cardsController.attachment
    );

    // groups
    router.get('/groups', mw.auth, groupController.list);
    router.post('/groups', groupController.create);
    router.put('/groups/assign', groupController.assign);
    router.get('/groups/user/:user_id', groupController.for_user);
    router.get('/groups/:id', groupController.read);
    router.put('/groups/:id', groupController.update);
    router.delete('/groups/:id', groupController.delete);
    router.put('/groups/:id/action', groupController.action);

    // tags
    router.get('/tags', tagsController.index);
    router.post('/tags', tagsController.create);
    router.post('/tags/add', tagsController.add_tags_to_docs);
    router.get('/tags/:id', tagsController.read);
    router.put('/tags/:id', tagsController.update);
    router.delete('/tags/:id', tagsController.delete);

    // user -> carddata
    router.get('/user/card', mw.auth, cardsController.list);
    router.post('/user/card', mw.auth, cardsController.create);
    router.get('/user/card/:id', mw.auth, cardsController.read);
    router.put('/user/card/:id', mw.auth, cardsController.update);
    router.delete('/user/card/:id', mw.auth, cardsController.delete);

    // users
    router.get('/users', mw.auth, mw.level(3), usersController.list);
    router.post('/users', mw.auth, mw.level(3), usersController.create);
    router.get('/users/:id', mw.auth, mw.level(0), usersController.read); // use level 1 for now. user-client uses this for init.
    router.put('/users/:id', mw.auth, mw.level(3), usersController.update);
    router.delete('/users', mw.auth, mw.level(3), usersController.delete);

    router.get(
        '/users/:user_id/groups',
        mw.auth,
        mw.level(3),
        groupController.for_user
    );

    router.get('/activites', mw.auth, mw.level(3), activityController.index);

    return router;
}
