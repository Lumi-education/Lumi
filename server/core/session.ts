import * as shortid from 'shortid';

class Session {
	constructor() {
		this._id = 'fixed_id'; //shortid();
	}

	private _id: string;

	public get id(): string {
		return this._id;
	}

	public set id(session_id: string) {
		this._id = session_id;
	}
}

const s = new Session();

export default s;