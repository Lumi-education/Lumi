import { Map } 			from 'immutable';
import { IState } 		from '../';

import { 
	ITag
} from 'lib/types';

export function select_all_tags(state: IState): Array<ITag> {
	return state.tags.list.toArray();
}