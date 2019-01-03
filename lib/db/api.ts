import db from './db';
import { assign } from 'lodash';
import * as Core from 'lib/core';

import { IQuery, IFindResponse } from './types';
export function create<T>(doc: T): Promise<T[]> {
    return db
        .post(doc)
        .then(response => {
            return [assign({}, doc, { _id: response.id, _rev: response.rev })];
        })
        .catch(error => {
            Core.raven.captureException(error);
        });
}

export function batch_create<T>(docs: T[]): Promise<T[]> {
    return db
        .bulkDocs(docs)
        .then(response => {
            return docs.map((doc, index) =>
                assign({}, doc, {
                    _id: response[index].id,
                    _rev: response[index].rev
                })
            );
        })
        .catch(error => {
            Core.raven.captureException(error);
        });
}

export function batch_update<T>(docs: T[]): Promise<T[]> {
    return batch_create<T>(docs);
}

export function remove<T>(docs: T[]): Promise<T[]> {
    const _docs = docs.map(doc => assign({}, doc, { _deleted: true }));
    return batch_update<T>(_docs);
}

export function find<T>(query: IQuery): Promise<IFindResponse<T>> {
    return db.find(query);
}

export function update<T>(doc: T): Promise<T[]> {
    return db
        .put(doc)
        .then(response => {
            return [assign({}, doc, { _id: response.id, _rev: response.rev })];
        })
        .catch(error => {
            Core.raven.captureException(error);
        });
}
