import { UI } 	from './types';

import {
	UI_DIALOG_CLOSE,
	UI_DIALOG_OPEN,
	UI_LEFT_DRAWER_CLOSE,
	UI_OPEN_LEFT_DRAWER,
	UI_RIGHT_DRAWER_CLOSE,
	UI_RIGHT_DRAWER_OPEN,
} from './constants';

export function dialog_open() {
	return {
		type: UI_DIALOG_OPEN,
	};
}

export function dialog_close() {
	return {
		type: UI_DIALOG_CLOSE,
	};
}
export function left_drawer_open() {
	return {
		type: UI_OPEN_LEFT_DRAWER,
	};
}

export function left_drawer_close() {
	return {
		type: UI_LEFT_DRAWER_CLOSE,
	};
}

export function right_drawer_open() {
	return {
		type: UI_RIGHT_DRAWER_OPEN,
	};
}

export function right_drawer_close() {
	return {
		type: UI_RIGHT_DRAWER_CLOSE,
	};
}
