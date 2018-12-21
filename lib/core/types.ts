export type Markdown = string;

export type Locales = 'de' | 'en';
export type ITarget = 'pi' | 'electron' | 'development';

export interface IDoc {
    _id: string;
    _rev: string;
    _deleted: boolean;
    _attachments: any;
}

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
    target: ITarget;
    installed: boolean;
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
