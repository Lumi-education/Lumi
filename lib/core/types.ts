export interface IState {
    core: {
        system: ISystemSettings;
        status: IStatus;
    };
}

export interface ISystemSettings {
    _id: 'system';
    changes_port: number;
}

export interface IStatus {
    connected: boolean;
}
