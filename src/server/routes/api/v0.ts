import * as express from 'express';
import * as debug from 'debug';
import * as path from 'path';

import mw from '../../middleware';

import AuthController from '../../controllers/api/auth.controller';
import CardsController from '../../controllers/api/cards.controller';
import GroupController from '../../controllers/api/groups.controller';
import UsersController from '../../controllers/api/users.controller';
import TagsController from '../../controllers/api/tags.controller';
import GradesController from '../../controllers/api/grades.controller';
import CoreController from '../../controllers/api/core.controller';
import FlowController from '../../controllers/api/flow.controller';

const log = debug('lumi:routes:api');

export default function(): express.Router {
    log('start boot-sequence');
    const router = express.Router();

    const authController = new AuthController();
    const cardsController = new CardsController();
    const groupController = new GroupController();
    const usersController = new UsersController();
    const tagsController = new TagsController();
    const gradesController = new GradesController();
    const coreController = new CoreController();
    const flowController = new FlowController();

    router.post('/flow/assign', flowController.assign);
    router.get('/flow/assignments', flowController.get_assignments);
    router.delete('/flow/assignments', flowController.delete_assignments);
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

    router.put('/flow/assignments', flowController.update_assignments);

    router.post('/core/find', mw.auth, coreController.find);
    router.post('/core/update', mw.auth, mw.level(3), coreController.update);
    router.get('/core/doc/:id', mw.auth, coreController.doc);

    router.post('/core/upload', coreController.upload);
    router.get('/core/upload', express.static(path.resolve('build/upload')));

    router.post('/system/shutdown', coreController.shutdown);
    router.get('/system/settings', coreController.settings);

    // mw.auth
    router.post('/auth/login', authController.login);
    router.post('/auth/register', authController.register);
    router.post('/auth/logout', mw.auth, authController.logout);
    router.get('/user/auth/session', mw.auth, authController.get_session);
    router.get('/auth/username/:username', authController.username);
    router.post('/auth/password', authController.set_password);

    // cards
    router.get('/cards', cardsController.list);
    router.post('/cards', cardsController.create);
    router.get('/cards/:id', cardsController.read);
    router.put('/cards/:id', cardsController.update);
    router.delete('/cards/:id', cardsController.delete);

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

    router.post('/h5p', cardsController.h5p_upload);

    // cards -> attachments
    router.all('/cards/:id/attachment/:attachment', cardsController.attachment);

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
    router.get('/users', usersController.list);
    router.post('/users', usersController.create);
    router.get('/users/:id', usersController.read);
    router.put('/users/:id', mw.auth, usersController.update);
    router.delete('/users', usersController.delete);

    router.get('/users/:user_id/grades', gradesController.user);
    router.post('/users/:user_id/grades', gradesController.create);
    router.delete('/grades/:id', gradesController.delete);
    router.put('/grades/:id', gradesController.update);

    router.get('/users/:user_id/groups', mw.auth, groupController.for_user);
    router.post('/users/:user_id/groups', mw.auth);
    router.put('/users/:user_id/groups', mw.auth);
    router.delete('/users/:user_id/groups/:group_id', mw.auth);

    return router;
}
