import { Group } from './models';
import * as DB from 'lib/db';

export function delete_groups(groups: Group[]): Promise<Group[]> {
    return DB.api.remove<Group>(groups);
}

export function update(groups: Group[]): Promise<Group[]> {
    return DB.api.batch_update<Group>(groups);
}

export function find<T>(
    query: DB.types.IQuery
): Promise<DB.types.IFindResponse<T>> {
    return DB.api.find<T>(query);
}
