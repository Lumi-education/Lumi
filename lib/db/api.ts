import db from './db';
import { assign } from 'lodash';
import * as Core from 'lib/core';

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
