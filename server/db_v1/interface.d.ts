export interface IDB {
    view: IViewFn;
    findById: IfindByIdFn;
    find: IFindFn;
    insert: IInsertFn;
    insertMany: IInsertManyFn;
    init: IInitFn;
    drop: () => Promise<{ ok: boolean }>;
}

interface IViewResponse<T> {
    total_rows: number;
    offtset: number;
    rows: IRow<T>[];
}

interface IFindResponse<T> {
    bookmark: string;
    docs: T[];
    warning?: string;
}

interface IMutateResponse {
    id: string;
    rev: string;
    ok: boolean;
}

interface IViewFn {
    <T>(_design: string, index: string, options): Promise<IViewResponse<T>>;
}

interface IfindByIdFn {
    <T>(id: string): Promise<T>;
}

interface IFindFn {
    <T>(query: IQuery): Promise<IFindResponse<T>>;
}

interface IInsertFn {
    <T>(doc: T): Promise<IMutateResponse>;
}

interface IInsertManyFn {
    <T>(docs: T[]): Promise<IMutateResponse[]>;
}

interface IRow<T> {
    id: string;
    key: string;
    doc: T;
}

interface IQuery {
    selector: any;
    fields?: string[];
    limit?: number;
}

interface IInitFn {
    (admin_user: IAdminUserInit): Promise<any>;
}

interface IAdminUserInit {
    name: string;
}
