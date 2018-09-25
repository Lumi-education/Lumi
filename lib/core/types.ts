export type Markdown = string;

export interface IState {
    core: {
        system: ISystemSettings;
        status: IStatus;
    };
}

export interface ISystemSettings {
    _id: 'system';
    changes_port: number;
    env: any;
    update: {
        tag_name: string;
        name: string;
        body: string;
        request_status: 'init' | 'pending' | 'success' | 'error';
    };
}

export interface IStatus {
    connected: boolean;
    status_page: boolean;
    status_page_text: string;
}
