import { Router } 						from 'express';
import { auth, level } 					from '../middleware/auth';
import mw 								from '../middleware';

import * as UserCollectionController 	from '../controllers/api/user/collection.controller';
import * as UserMaterialController 		from '../controllers/api/user/material.controller';
import AuthController 					from '../controllers/api/auth.controller';
import * as OldAuthController			from '../controllers/api/auth.controller';
import * as TestController				from '../controllers/api/test.controller';
import * as UserController 				from '../controllers/api/user/user.controller';

import CollectionDataController			from '../controllers/api/user/collection.controller';
import * as MaterialController 			from '../controllers/api/material.controller';

import CardsController 					from '../controllers/api/cards.controller';
import CollectionController 			from '../controllers/api/collections.controller';
import GroupController 					from '../controllers/api/groups.controller';
import UsersController 					from '../controllers/api/users.controller';
import TagsController 					from '../controllers/api/tags.controller';

const router = Router();

// mw.auth
router.post('/auth/login', AuthController.login );
// router.post('/auth/logout', mw.auth, AuthController.logout );
// router.post('/auth/register', AuthController.register );
// router.put(	'/auth/session', mw.auth, AuthController.put_session );
// router.get(	'/auth/session_id', mw.auth, AuthController.get_session_id );

// cards
router.get(	'/cards', CardsController.list );
router.post('/cards', CardsController.create );
router.get(	'/cards/:id', CardsController.read );
router.put(	'/cards/:id', CardsController.update );
router.delete('/cards/:id', CardsController.delete);

// collections
router.get(	'/collections', CollectionController.list );
router.post('/collections', CollectionController.create );
router.get(	'/collections/:id', CollectionController.read );
router.put(	'/collections/:id', CollectionController.update );
router.delete('/collections/:id', CollectionController.delete );		

router.get(	'/collections/:id/cards', CollectionController.cards );
router.get(	'/collections/:id/tags', CollectionController.tags );

// groups
router.get(	'/groups', mw.auth, GroupController.list );
router.post('/groups', GroupController.create );
router.get(	'/groups/:id', GroupController.read );
router.put('/groups/:id', GroupController.update );
router.delete('/groups/:id', GroupController.delete );
router.put(	'/groups/:id/action', GroupController.action );

// tags
router.get(	'/tags', mw.auth, TagsController.list );
router.post('/tags', TagsController.create );
router.get(	'/tags/:id', TagsController.read );
router.put('/tags/:id', TagsController.update );
router.delete('/tags/:id', TagsController.delete );

// user
router.get('/user', mw.auth, UserController.get_user );

// user -> carddata
router.get('/user/card', mw.auth, CardsController.list );
router.post('/user/card', mw.auth, CardsController.create );
router.get('/user/card/:id', mw.auth, CardsController.read );
router.put('/user/card/:id', mw.auth, CardsController.update );
router.delete('/user/card/:id', mw.auth, CardsController.delete );

// user -> collectiondata
router.get(	'/user/collections', mw.auth, CollectionDataController.list );
router.post('/user/collections', mw.auth, CollectionDataController.create );
router.get(	'/user/collections/:id', mw.auth, CollectionDataController.read );
router.put(	'/user/collections/:id', mw.auth, CollectionDataController.update );
router.delete('/user/collections/:id', mw.auth, CollectionDataController.delete );

// user -> groups
router.get('/user/groups', mw.auth );

// users
router.get(	'/users', UsersController.list );
router.post('/users', UsersController.create );
router.get(	'/users/:id', UsersController.read );
router.put(	'/users/:id', UsersController.update );
router.put(	'/users/:id/action', UsersController.action );
router.delete('/users/:id', UsersController.delete );

router.get(	'/users/:user_id/collections/:collection_id', mw.auth );
router.get(	'/users/:user_id/collections' , mw.auth, CollectionDataController.list_for_user );
router.put(	'/users/:user_id/collections/:collection_id', mw.auth );
router.get(	'/users/:user_id/cards/:card_id', mw.auth );
router.put(	'/users/:user_id/cards/:card_id', mw.auth );

router.get(	'/users/:user_id/groups', mw.auth, GroupController.for_user );
router.post('/users/:user_id/groups', mw.auth );
router.put(	'/users/:user_id/groups', mw.auth );
router.delete('/users/:user_id/groups/:group_id', mw.auth );

// deprecate

router.route('/material/:id/:attachment').get( MaterialController.attachment );
router.route('/user/collection')	.get( mw.auth, UserCollectionController.get_collection );
router.route('/user/collection/:_id/submit').put( mw.auth, UserCollectionController.submit_collection );
router.route('/user/collection/:_id/reset').put( mw.auth, UserCollectionController.reset_collection );
router.route('/user/auth/session').put( mw.auth, OldAuthController.put_session );
router.route('/user/material/meta')	.post( mw.auth, UserMaterialController.create_userdata );
router.route('/user/material/meta/:_id').put( mw.auth, UserMaterialController.update_userdata );
router.route('/user/assignments')	.get( mw.auth, UserCollectionController.get_collection );
router.route('/user/auth/login')	.post( AuthController.login );
router.route('/user/auth/register') .post( OldAuthController.register );
router.route('/user/auth/session')	.get( mw.auth, OldAuthController.get_session );
router.route('/user/v0/collectionmeta').post( mw.auth, UserCollectionController.create_collection );
router.route('/user/v0/collectionmeta/:_id/submit').put( mw.auth, UserCollectionController.submit_collection );
router.route('/user/v0/collectionmeta/:_id/reset').put( mw.auth, UserCollectionController.reset_collection );
router.get('/test', TestController.get_test );

export default router;