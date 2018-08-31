import { ITag, IState } from './types';

export function select_all_tags(state: IState): ITag[] {
    return state.tags.list;
}

export function tag(state: IState, tag_id: string): ITag {
    return (
        state.tags.list.filter(_tag => _tag._id === tag_id)[0] || {
            _id: undefined,
            type: 'tag',
            name: 'tag not found',
            short_name: '404',
            description: 'tag not found',
            color: 'red',
            created_at: new Date()
        }
    );
}

export function tags(state: IState, tag_ids: string[]): ITag[] {
    return state.tags.list.filter(_tag => tag_ids.indexOf(_tag._id) > -1);
}
