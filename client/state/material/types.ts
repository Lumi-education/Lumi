export interface Material {
    _id: string;
    name: string;
    description: string;
    material_type:
        | 'video'
        | 'markdown'
        | 'multiplechoice'
        | 'freetext'
        | 'sort';
    type: string;
    tag_list: string[];
    image?: string;
    task?: string;
    items?: string[];
    hints?: string[];
}

export interface MaterialMeta {
    _id: string;
    type: string;
    material_id: string;
    // material: Material;
    user_id: string;
    query: {
        run?: string;
        collection?: string;
        type?: string;
        material?: string;
    };
    score: number;
    hints: number;
    value: string[];
}

export interface Task extends Material {
    task: string;
    items: string[];
}

export interface MultipleChoice extends Task {
    solution: Array<number | string>;
}

export interface FreeText extends Task {
    solution: string[];
}

export interface Markdown extends Material {
    text: string;
}

export interface Sort extends Task {}

export interface TaskMeta extends MaterialMeta {}

export interface SortMeta extends TaskMeta {}

export interface MultipleChoiceMeta extends TaskMeta {}

export interface State {
    material: {
        list: Material[];
        meta: MaterialMeta[];
    };
}
