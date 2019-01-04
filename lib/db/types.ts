export type DBState =
    | 'init'
    | 'change'
    | 'paused'
    | 'active'
    | 'denied'
    | 'complete'
    | 'error';

export interface IDBUI {
    state: DBState;
    pending_docs: number;
    initial_docs: number;
}

export interface IState {
    db: IDBUI;
}

export interface IFindResponse<T> {
    bookmark: string;
    docs: T[];
    warning?: string;
}

export interface IQuery {
    selector: any;
    fields?: string[];
    limit?: number;
}
