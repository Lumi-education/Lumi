export const DB_ACTIVE = 'DB_ACTIVE';
export const DB_CHANGE = 'DB_CHANGE';
export const DB_COMPLETE = 'DB_COMPLETE';
export const DB_DENIED = 'DB_DENIED';
export const DB_ERROR = 'DB_ERROR';
export const DB_PAUSED = 'DB_PAUSED';
export const DB_PENDING_DOCS = 'DB_PENDIG_DOCS';
export const DB_START = 'DB_START';

export function active() {
    return { type: DB_ACTIVE };
}

export function change(payload: any[]) {
    return { payload, type: DB_CHANGE };
}

export function complete(payload) {
    return { payload, type: DB_COMPLETE };
}

export function denied(payload: Error) {
    return { payload, type: DB_DENIED };
}

export function error(payload: Error) {
    return { payload, type: DB_ERROR };
}

export function paused(payload: Error) {
    return { payload, type: DB_PAUSED };
}

export function pending_docs(num: number) {
    return {
        type: DB_PENDING_DOCS,
        payload: num
    };
}

export function start() {
    return {
        type: DB_START
    };
}
