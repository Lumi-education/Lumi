export interface IState {
    core: {
        system: ISystemSettings;
    };
}

export interface ISystemSettings {
    _id: 'system';
    changes_port: number;
}
