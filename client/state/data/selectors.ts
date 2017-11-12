import { Map } 			from 'immutable';
import { IState } 		from '../';

import { 
	IData
} from 'lib/types';

export function select_data(state: IState, collection_id: string, card_id: string) {
	return state.data.map.toArray()
	.filter(data => 
		(data as any).collection_id === collection_id && 
		(data as any).card_id === card_id && 
		(data as any).data_type === 'card')[0]
	|| {};
}

export function select_data_as_map(state: IState) {
	return state.data.map;
}

export function select_data_for_collection(state: IState, collection_id: string) {
	return state.data.map.toArray()
	.filter(data => (data as any).collection_id === collection_id && (data as any).data_type === 'collection')[0]
	|| {};
}