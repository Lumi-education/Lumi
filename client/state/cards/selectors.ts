import { Map } 			from 'immutable';
import { IState } 		from '../';

import { 
	ICard
} from 'lib/types';

export function select_all_cards(state: IState): Array<ICard> {
	return state.cards.map.toArray();
}

export function select_cards_as_map(state: IState): Map<string, ICard> {
	return state.cards.map;
}

export function select_card(state: IState, card_id: string): ICard {
	return state.cards.map.get( card_id, {
		_id: undefined,
		type: 'card',
		card_type: undefined,
		tags: [],
		name: 'card not found',
		text: 'card not found',
		items: [],
		hints: [],
		description: '',
		url: '',
		created_at: new Date(),
		_attachments: {}
	});
}