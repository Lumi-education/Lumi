import * as request from 'superagent';
import { assign } 	from 'lodash';
declare var window;

export function get_cards() {
	return request
	.get('/api/v0/cards')
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function rem_tag(card_id: string, tag_id: string) {
	return request
	.put('/api/v0/cards/' + card_id + '/action')
	.send({
		type: 'REM_TAG',
		payload: { tag_id }
	})
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}

export function add_tag(card_id: string, tag_id: string) {
	return request
	.put('/api/v0/cards/' + card_id + '/action')
	.send({
		type: 'ADD_TAG',
		payload: { tag_id }
	})
	.set('x-auth',  window.localStorage.jwt_token || window.jwt_token || '');	
}