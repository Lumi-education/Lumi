import { State as Auth } 		from './auth/types';
import { State as Collection }	from './collection/types';
import { State as Material }  	from './material/types';
import { State as UI } 			from './ui/types';
// import { State as User } 		from 'lib/user/types';
// import { State as Settings } 	from 'lib/settings/types';
// import { State as Lesson } 		from 'lib/lesson/types';
import { State as Request } 	from './request/types';
// import { State as Group } 		from 'lib/group/types';

export interface State extends 
Auth,
Collection,
Material,
UI,
Request {}