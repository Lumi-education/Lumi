// modules
import * as React from 'react';
import { Map } from 'immutable';

import Avatar from 'material-ui/Avatar';
import AutoComplete from 'material-ui/AutoComplete';
import ChipInput from 'material-ui-chip-input';

import Tag from 'client/components/tag';

import { ITag } from 'lib/types';

interface IStateProps {
    tags: Map<string, ITag>;
    tag_ids: Array<string>;
}

interface IDispatchProps {
    add: (tag: ITag) => void;
    delete: (tag_id: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export default class TagInput extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <ChipInput
                hintText="Tags"
                floatingLabelText="Tags"
                fullWidth={true}
                value={this.props.tag_ids.map(tag_id =>
                    this.props.tags.get(tag_id, {
                        _id: undefined,
                        name: 'tag not found',
                        type: 'tag',
                        short_name: 'err',
                        description: 'this tag was not found',
                        color: 'red',
                        created_at: new Date()
                    })
                )}
                chipRenderer={(
                    {
                        value,
                        isFocused,
                        isDisabled,
                        handleClick,
                        handleRequestDelete,
                        defaultStyle
                    },
                    key
                ) => (
                    <Tag
                        tags={this.props.tags}
                        tag_id={value}
                        delete={handleRequestDelete}
                    />
                )}
                allowDuplicates={false}
                dataSource={this.props.tags.toArray()}
                dataSourceConfig={{ text: 'name', value: '_id' }}
                openOnFocus={true}
                filter={AutoComplete.fuzzyFilter}
                onRequestAdd={this.props.add}
                onRequestDelete={this.props.delete}
            />
        );
    }
}

// onRequestAdd={(group) => {
// 	this.props.groups.get(group._id)
// 	?
// 	this.props.dispatch( add_group(this.props.user._id, group._id))
// 	:
// 	this.props.dispatch( create_and_add_group( this.props.user._id, group.name ) );
// }}
// onRequestDelete={(group_id) => this.props.dispatch( rem_group(this.props.user._id, group_id))}
