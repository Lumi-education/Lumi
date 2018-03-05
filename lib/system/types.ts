export interface ISystemSettings {
    _id: 'system';
    enable_guest_accounts: boolean;
    auto_guest_login: boolean;
    auto_assign_to_groups: string[];
}

export interface IState {
    system: ISystemSettings;
}
