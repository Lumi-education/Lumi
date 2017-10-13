import { State as Auth } 		from './auth/types';
import { State as Collection }	from './collection/types';
import { State as Material }  	from './material/types';
import { State as UI } 			from './ui/types';
import { State as Request } 	from './request/types';
import { State as Session } 	from './session/types';

export interface State extends 
Auth,
Collection,
Material,
UI,
Request,
Session {}