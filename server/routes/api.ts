import { Router } 						from 'express';
import { auth, level } 					from '../middleware/auth';

import * as UserCollectionController 	from '../controllers/api/user/collection.controller';
import * as UserMaterialController 		from '../controllers/api/user/material.controller';
import * as AuthController 				from '../controllers/api/auth.controller';
import * as TestController				from '../controllers/test.controller';
import * as UserController 				from '../controllers/api/user/user.controller';

import * as MaterialController 			from '../controllers/api/material.controller';

const router = Router();

router.route('/auth/login')			.post( AuthController.login );
router.route('/auth/logout')		.post( auth, AuthController.logout );
router.route('/auth/register')		.post( AuthController.register );
router.route('/auth/session')		.put( auth, AuthController.put_session );
router.route('/auth/session_id')	.get( auth, AuthController.get_session_id );

router.route('/user')				.get( auth, UserController.get_user );

router.route('/user/collection')	.get( auth, UserCollectionController.get_collection );
router.route('/user/collection/:_id/submit').put( auth, UserCollectionController.submit_collection );
router.route('/user/collection/:_id/reset').put( auth, UserCollectionController.reset_collection );

// deprecate
router.route('/material/:id/:attachment').get( MaterialController.attachment );
router.route('/user/auth/session').put( auth, AuthController.put_session );
router.route('/user/material/meta')	.post( auth, UserMaterialController.create_userdata );
router.route('/user/material/meta/:_id').put( auth, UserMaterialController.update_userdata );
router.route('/user/assignments')	.get( auth, UserCollectionController.get_collection );
router.route('/user/auth/login')	.post( AuthController.login );
router.route('/user/auth/register') .post( AuthController.register );
router.route('/user/auth/session')	.get( auth, AuthController.get_session );
router.route('/user/v0/collectionmeta').post( auth, UserCollectionController.create_collection );
router.route('/user/v0/collectionmeta/:_id/submit').put( auth, UserCollectionController.submit_collection );
router.route('/user/v0/collectionmeta/:_id/reset').put( auth, UserCollectionController.reset_collection );
router.route('/test')					.get( TestController.get_test );

export default router;