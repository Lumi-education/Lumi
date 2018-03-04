export interface ISystemSettings {
    _id: 'system';
    enable_guest_accounts: boolean;
    auto_guest_login: boolean;
}

export interface IState {
    system: ISystemSettings;
}
