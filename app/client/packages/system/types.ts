export interface ISystem {
    db: string;
    db_status: 'init' | 'pending' | 'success' | 'error';
}

export interface IState {
    system: ISystem;
}
