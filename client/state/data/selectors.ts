import { Map } 			from 'immutable';
import { IState } 		from '../';

import { 
	IData
} from 'lib/types';

export function select_data(state: IState, collection_id: string, card_id: string) {
	return state.data.map.toArray()
	.filter(data => (data as any).collection_id === collection_id && (data as any).card_id === card_id)[0]
	|| {};
}