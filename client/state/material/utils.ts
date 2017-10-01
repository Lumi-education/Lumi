import { isEqual }  		from 'lodash';

import {
	Material,
	MaterialMeta,

	MultipleChoice,
	FreeText
} from './types';

export function correct(material: Material, meta: MaterialMeta):boolean {
	let m;
	try {
		switch(material.material_type) {

		case 'multiplechoice':
			m = material as MultipleChoice;
			return isEqual( m.answer_list.sort() , meta.data.sort() );

		case 'freetext':
			 m = material as FreeText;
			 return m
			 .answer_list
			 .map(a => a.replace(/\s+/g, '') )
			 .indexOf( meta.data[0].replace(/\s+/g, '') ) > -1;
	}
		return false;
	} catch(err) { 
		return false; 
	}
	
}

export function correct_list(material_list: Array<Material>, material_meta_list: Array<MaterialMeta>): any {
	// const num_correct_answer =
	// material_list
	// .filter(material => (material.material_type !== 'text' &&  material.material_type !== 'video') )
	// .filter(m => correct(m, material_meta_list.filter(meta => meta.material_id == m._id)[0] ) ).length;

	// const num_material = material_list
	// 	.filter(material => (material.material_type !== 'text' &&  material.material_type !== 'video') )
	// 	.length;

	// const grade = num_correct_answer / num_material * 100;

	// return {
	// 	num_material,
	// 	num_correct_answer,
	// 	grade
	// };
}

