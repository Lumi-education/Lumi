import {
	assign,
	unionBy,
}				from 'lodash';

const initialState: {} = {};

export default function(state: {} = initialState, action): {} {

	const a: Array<string> = action.type.split('_');
	const status = a[ a.length - 1 ];

	let o;
	switch (status) {

		case 'REQUEST':
			o = {}; o[action.id] = 'pending';
			return assign({}, state, o); 

		case 'SUCCESS':
			o = {}; o[action.id] = 'success';
			return assign({}, state, o);

		case 'ERROR':
			o = {}; o[action.id] = 'error';
			return assign({}, state, o);

		default:
			return state;
	}

}
