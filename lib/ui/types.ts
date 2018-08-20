export interface IUI {
    left_drawer_show: boolean;
    right_drawer_show: boolean;
    dialog_show: boolean;
    snackbar_open: boolean;
    snackbar_text: string;
    show_cards_dialog: boolean;
    selected_card_ids: string[];
    right_appbar_icon: JSX.Element;
    appbar_title: string;
    show_assign_material_dialog: boolean;
    show_create_user_dialog: boolean;
    show_assign_group_dialog: boolean;
    show_delete_user_dialog: boolean;
    show_create_card_dialog: boolean;
    show_completed_assignments: boolean;
}

export interface IState {
    ui: IUI;
}
