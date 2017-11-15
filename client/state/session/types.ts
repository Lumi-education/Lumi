// import { User_id } 		from '../user/types';

export type Session_id = string;

export interface Session {
    _id: string;
    session_id: string;
    user_id: string;
    last_active: Date;
    login: Date;
    logout: Date;
    online: boolean;
    location: string;
    type: 'session';
}

export interface State {
    session: {
        id: Session_id;
        list: Array<Session>;
    };
}
