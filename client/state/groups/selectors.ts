import { Map } 			from 'immutable';
import { IState } 		from '../';

import { 
	IGroup
} from 'lib/types';

export function groups_list(state: IState): Array<IGroup> {
	return state.groups.list.toArray();
}