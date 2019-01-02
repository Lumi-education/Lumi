import { unionBy } from 'lodash';

import { ITag } from '../types';

import { TAGS_CREATE_TAG_SUCCESS, TAGS_DELETE_TAG_SUCCESS } from '../actions';

export default function(state: ITag[] = [], action): ITag[] {
    switch (action.type) {
        case 'DB_CHANGE':
            return unionBy(
                action.payload.filter(d => d.type === 'tag'),
                state,
                '_id'
            );

        case TAGS_CREATE_TAG_SUCCESS:
            return unionBy([action.payload], state, '_id');

        case TAGS_DELETE_TAG_SUCCESS:
            return state.filter(tag => tag._id !== action.tag_id);

        default:
            return state;
    }
}
