import { Router } from 'express';
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
import SystemController from '../controllers/api/system.controller';
import GradesController from '../controllers/api/grades.controller';

const router = Router();

router.get('/:db', SystemController.checkDb);

// mw.auth
router.post('/:db/auth/login', AuthController.login);
router.post('/:db/auth/register', AuthController.register);
router.post('/:db/auth/logout', mw.auth, AuthController.logout);
router.get('/:db/user/auth/session', mw.auth, AuthController.get_session);
router.get('/:db/auth/username/:username', AuthController.username);
router.post('/:db/auth/password', AuthController.set_password);

// cards
router.get('/:db/cards', CardsController.list);
router.post('/:db/cards', CardsController.create);
router.get('/:db/cards/:id', CardsController.read);
router.put('/:db/cards/:id', CardsController.update);
router.delete('/:db/cards/:id', CardsController.delete);
router.put('/:db/cards/:id/action', CardsController.action);
// cards -> attachments
router.all('/:db/cards/:id/attachment/:attachment', CardsController.attachment);

// collections
router.get('/:db/collections', CollectionController.list);
router.post('/:db/collections', CollectionController.create);
router.get('/:db/collections/:id', CollectionController.read);
router.put('/:db/collections/:id', CollectionController.update);
router.delete('/:db/collections/:id', CollectionController.delete);
router.put('/:db/collections/:id/action', CollectionController.action);

// groups
router.get('/:db/groups', mw.auth, GroupController.list);
router.post('/:db/groups', GroupController.create);
router.get('/:db/groups/user/:user_id', GroupController.for_user);
router.get('/:db/groups/:id', GroupController.read);
router.put('/:db/groups/:id', GroupController.update);
router.delete('/:db/groups/:id', GroupController.delete);
router.put('/:db/groups/:id/action', GroupController.action);

// tags
router.get('/:db/tags', TagsController.index);
router.post('/:db/tags', TagsController.create);
router.get('/:db/tags/ref', TagsController.readRef);
router.get('/:db/tags/refs', TagsController.indexRef);
router.get('/:db/tags/:id', TagsController.read);
router.put('/:db/tags/:id', TagsController.update);
router.delete('/:db/tags/:id', TagsController.delete);
router.put('/:db/tags/:id/action', TagsController.action);

// data
router.get('/:db/data', mw.auth, DataController.find);
router.post('/:db/data', DataController.create);
router.put(
    '/:db/data/submit_collection',
    mw.auth,
    DataController.submit_collection
);
router.get('/:db/data/:id', DataController.read);
router.put('/:db/data/:id', DataController.update);
router.delete('/:db/data/:id', DataController.delete);

// user -> carddata
router.get('/:db/user/card', mw.auth, CardsController.list);
router.post('/:db/user/card', mw.auth, CardsController.create);
router.get('/:db/user/card/:id', mw.auth, CardsController.read);
router.put('/:db/user/card/:id', mw.auth, CardsController.update);
router.delete('/:db/user/card/:id', mw.auth, CardsController.delete);

router.get(
    '/:db/user/data/collections/:collection_id',
    mw.auth,
    DataController.forUserAndCollection
);

router.get('/:db/user/collections', mw.auth, CollectionController.for_user);

router.post('/:db/user/data', mw.auth, UserController.createData);
router.put('/:db/user/data/:id', mw.auth, UserController.updateData);

// user -> groups
router.get('/:db/user/groups', mw.auth);

// users
router.get('/:db/users', UsersController.list);
router.post('/:db/users', UsersController.create);
router.get('/:db/users/:id', UsersController.read);
router.put('/:db/users/:id', UsersController.update);
router.put('/:db/users/:id/action', UsersController.action);
router.delete('/:db/users/:id', UsersController.delete);

router.get('/:db/users/:user_id/grades', GradesController.user);
router.post('/:db/users/:user_id/grades', GradesController.create);
router.delete('/:db/grades/:id', GradesController.delete);

router.get('/:db/users/:user_id/collections/:collection_id', mw.auth);
router.put('/:db/users/:user_id/collections/:collection_id', mw.auth);
router.get('/:db/users/:user_id/cards/:card_id', mw.auth);
router.put('/:db/users/:user_id/cards/:card_id', mw.auth);

router.get('/:db/users/:user_id/groups', mw.auth, GroupController.for_user);
router.post('/:db/users/:user_id/groups', mw.auth);
router.put('/:db/users/:user_id/groups', mw.auth);
router.delete('/:db/users/:user_id/groups/:group_id', mw.auth);

export default router;
