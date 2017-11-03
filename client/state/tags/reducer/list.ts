import {
	assign,
	unionBy,
}				from 'lodash';

import { Map } from 'immutable';

import { 
	ITag 
} 							from 'lib/types';

import { arrayToObject } 	from 'client/utils';

import { 
	TAGS_GET_TAGS_SUCCESS
} 							from 'client/state/action-types';

export default function(state: Map<string, ITag> = Map<string, ITag>({}), action): Map<string, ITag> {
	switch (action.type) {

		case TAGS_GET_TAGS_SUCCESS:
			return state.merge( Map<string, ITag>( arrayToObject(action.payload.tags) ) );

		default:
			return state;
	}

}
