import * as express from 'express';
import * as debug from 'debug';
import { auth, level } from '../middleware/auth';
import mw from '../middleware';

import AuthController from '../controllers/api/auth.controller';
import DataController from '../controllers/api/data.controller';
import CardsController from '../controllers/api/cards.controller';
import CollectionController from '../controllers/api/collections.controller';
import GroupController from '../controllers/api/groups.controller';
import UsersController from '../controllers/api/users.controller';
import UserController from '../controllers/api/user.controller';
import TagsController from '../controllers/api/tags.controller';
import GradesController from '../controllers/api/grades.controller';
import CoreController from '../controllers/api/core.controller';

const log = debug('lumi:routes:api');

export default function(): express.Router {
    log('start boot-sequence');
    const router = express.Router();

    const authController = new AuthController();
    const dataController = new DataController();
    const cardsController = new CardsController();
    const collectionController = new CollectionController();
    const groupController = new GroupController();
    const usersController = new UsersController();
    const userController = new UserController();
    const tagsController = new TagsController();
    const gradesController = new GradesController();
    const coreController = new CoreController();

    router.post('/core/find', mw.auth, mw.level(3), coreController.find);
    router.post('/core/update', mw.auth, mw.level(3), coreController.update);
    router.post(
        '/core/action/:action',
        mw.auth,
        mw.level(3),
        coreController.action
    );
    router.get('/core/doc/:id', mw.auth, mw.level(3), coreController.doc);

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
    router.put('/cards/:id/action', cardsController.action);
    // cards -> attachments
    router.all('/cards/:id/attachment/:attachment', cardsController.attachment);

    // collections
    router.get('/collections', collectionController.list);
    router.post('/collections', collectionController.create);
    router.get('/collections/:id', collectionController.read);
    router.put('/collections/:id', collectionController.update);
    router.delete('/collections/:id', collectionController.delete);
    router.put('/collections/:id/action', collectionController.action);

    // groups
    router.get('/groups', mw.auth, groupController.list);
    router.post('/groups', groupController.create);
    router.get('/groups/user/:user_id', groupController.for_user);
    router.get('/groups/:id', groupController.read);
    router.put('/groups/:id', groupController.update);
    router.delete('/groups/:id', groupController.delete);
    router.put('/groups/:id/action', groupController.action);

    // tags
    router.get('/tags', tagsController.index);
    router.post('/tags', tagsController.create);
    router.get('/tags/ref', tagsController.readRef);
    router.get('/tags/refs', tagsController.indexRef);
    router.get('/tags/:id', tagsController.read);
    router.put('/tags/:id', tagsController.update);
    router.delete('/tags/:id', tagsController.delete);
    router.put('/tags/:id/action', tagsController.action);

    // data
    router.get('/data', mw.auth, dataController.find);
    router.post('/data', dataController.create);
    router.put(
        '/data/submit_collection',
        mw.auth,
        dataController.submit_collection
    );
    router.get('/data/:id', dataController.read);
    router.put('/data/:id', dataController.update);
    router.delete('/data/:id', dataController.delete);

    // user -> carddata
    router.get('/user/card', mw.auth, cardsController.list);
    router.post('/user/card', mw.auth, cardsController.create);
    router.get('/user/card/:id', mw.auth, cardsController.read);
    router.put('/user/card/:id', mw.auth, cardsController.update);
    router.delete('/user/card/:id', mw.auth, cardsController.delete);

    router.get(
        '/user/data/collections/:collection_id',
        mw.auth,
        dataController.forUserAndCollection
    );

    router.get('/user/collections', mw.auth, collectionController.for_user);

    router.post('/user/data', mw.auth, userController.createData);
    router.put('/user/data/:id', mw.auth, userController.updateData);

    // user -> groups
    router.get('/user/groups', mw.auth);

    // users
    router.get('/users', usersController.list);
    router.post('/users', usersController.create);
    router.post('/users/action/:action', usersController.actions);
    router.get('/users/:id', usersController.read);
    router.put('/users/:id', mw.auth, usersController.update);
    router.put('/users/:id/action', usersController.action);
    router.delete('/users/:id', usersController.delete);
    router.get('/users/:id/init', usersController.init);

    router.get('/users/:user_id/grades', gradesController.user);
    router.post('/users/:user_id/grades', gradesController.create);
    router.delete('/grades/:id', gradesController.delete);
    router.put('/grades/:id', gradesController.update);

    router.get('/users/:user_id/collections/:collection_id', mw.auth);
    router.put('/users/:user_id/collections/:collection_id', mw.auth);
    router.get('/users/:user_id/cards/:card_id', mw.auth);
    router.put('/users/:user_id/cards/:card_id', mw.auth);

    router.get('/users/:user_id/groups', mw.auth, groupController.for_user);
    router.post('/users/:user_id/groups', mw.auth);
    router.put('/users/:user_id/groups', mw.auth);
    router.delete('/users/:user_id/groups/:group_id', mw.auth);

    return router;
}
