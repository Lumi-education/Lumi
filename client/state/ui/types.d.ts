export interface UI {
	left_drawer_show: boolean;
	right_drawer_show: boolean;
	dialog_show: boolean;
	snackbar_open: boolean;
	snackbar_text: string;
}

export interface State {
	ui: UI;
}

