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

const router = Router();

// mw.auth
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.post('/auth/logout', mw.auth, AuthController.logout);
router.get('/user/auth/session', mw.auth, AuthController.get_session);

// cards
router.get('/cards', CardsController.list);
router.post('/cards', CardsController.create);
router.get('/cards/:id', CardsController.read);
router.put('/cards/:id', CardsController.update);
router.delete('/cards/:id', CardsController.delete);
router.put('/cards/:id/action', CardsController.action);
// cards -> attachments
router.all('/cards/:id/attachment/:attachment', CardsController.attachment);

// collections
router.get('/collections', CollectionController.list);
router.post('/collections', CollectionController.create);
router.get('/collections/:id', CollectionController.read);
router.put('/collections/:id', CollectionController.update);
router.delete('/collections/:id', CollectionController.delete);

router.get('/collections/:id/cards', CollectionController.cards);
router.get('/collections/:id/tags', CollectionController.tags);

// groups
router.get('/groups', mw.auth, GroupController.list);
router.post('/groups', GroupController.create);
router.get('/groups/:id', GroupController.read);
router.put('/groups/:id', GroupController.update);
router.delete('/groups/:id', GroupController.delete);
router.put('/groups/:id/action', GroupController.action);

// tags
router.get('/tags', mw.auth, TagsController.list);
router.post('/tags', TagsController.create);
router.get('/tags/:id', TagsController.read);
router.put('/tags/:id', TagsController.update);
router.delete('/tags/:id', TagsController.delete);

// data
router.get('/data', mw.auth, DataController.find);
router.post('/data', DataController.create);
router.get('/data/:id', DataController.read);
router.put('/data/:id', DataController.update);
router.delete('/data/:id', DataController.delete);

// user -> carddata
router.get('/user/card', mw.auth, CardsController.list);
router.post('/user/card', mw.auth, CardsController.create);
router.get('/user/card/:id', mw.auth, CardsController.read);
router.put('/user/card/:id', mw.auth, CardsController.update);
router.delete('/user/card/:id', mw.auth, CardsController.delete);

router.get('/user/collections', mw.auth, UserController.collections);

router.post('/user/data', mw.auth, UserController.createData);
router.put('/user/data/:id', mw.auth, UserController.updateData);

// user -> groups
router.get('/user/groups', mw.auth);

// users
router.get('/users', UsersController.list);
router.post('/users', UsersController.create);
router.get('/users/:id', UsersController.read);
router.put('/users/:id', UsersController.update);
router.put('/users/:id/action', UsersController.action);
router.delete('/users/:id', UsersController.delete);

router.get('/users/:user_id/collections/:collection_id', mw.auth);
router.put('/users/:user_id/collections/:collection_id', mw.auth);
router.get('/users/:user_id/cards/:card_id', mw.auth);
router.put('/users/:user_id/cards/:card_id', mw.auth);

router.get('/users/:user_id/groups', mw.auth, GroupController.for_user);
router.post('/users/:user_id/groups', mw.auth);
router.put('/users/:user_id/groups', mw.auth);
router.delete('/users/:user_id/groups/:group_id', mw.auth);

export default router;
