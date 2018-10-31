export type Markdown = string;

export type Locales = 'de' | 'en';

export interface IState {
    core: {
        system: ISystemSettings;
        status: IStatus;
    };
    i18n: {
        locale: Locales;
    };
}

export interface ISystemSettings {
    _id: 'system';
    mode: 'free' | 'controlled';
    ip: string;
    port: string;
    controlled_location: string;
    allow_user_registration: boolean;
    provide_password: boolean;
}

export interface IStatus {
    connected: boolean;
    status_page: boolean;
    status_page_text: string;
    env: any;
    update: {
        tag_name: string;
        name: string;
        body: string;
        request_status: 'init' | 'pending' | 'success' | 'error';
    };
}
