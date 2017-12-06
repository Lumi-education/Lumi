import { DB } from './';

export default class Relations {
    protected hasMany(db: DB, ids: string[], cb: (docs) => void, type?) {
        db.find({ _id: { $in: ids } }, { limit: 1000 }, cb, type);
    }

    protected hasOne(db: DB, id: string, cb: (doc) => void, type?) {
        db.findById(id, cb, type);
    }
}
