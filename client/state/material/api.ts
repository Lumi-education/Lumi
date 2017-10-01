import * as _API from "lib/api";

export function material_get(material_id: string) {
	return _API.find("lumidb", { selector: { _id: material_id }});
}

export function material_meta_get(material_id: string, query: Object, user_id?: string) {
	return _API.find("lumidb", { selector: {
		user_id,
		material_id,
		query,
	}});
}
