import * as request from 'superagent';
import { assign } 	from 'lodash';
import * as qs 		from 'query-string';
declare var window;

import { MaterialMeta } 	from './types';

export function update_material_meta(material_meta_id: string, update) {
	return request
	.put('/api/user/material/meta/' + material_meta_id)
	.send(update)
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function create_material_meta(material_meta: MaterialMeta) {
	return request
	.post('/api/user/material/meta/')
	.send(material_meta)
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}