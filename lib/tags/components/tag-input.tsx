// modules
import * as React from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import ChipInput from 'material-ui-chip-input';

import { ITag } from '../types';

interface IStateProps {
    tags: ITag[];
    tag_ids: string[];
}

interface IDispatchProps {
    add: (tag: ITag) => void;
    delete: (tag_id: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class TagInput extends React.Component<IProps, {}> {
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
                value={this.props.tag_ids.map(
                    tag_id =>
                        this.props.tags.filter(
                            tag => tag._id === tag_id
                        )[0] || {
                            _id: undefined,
                            name: 'tag not found',
                            type: 'tag',
                            short_name: 'err',
                            description: 'this tag was not found',
                            color: 'red',
                            created_at: new Date()
                        }
                )}
                allowDuplicates={false}
                dataSource={this.props.tags}
                dataSourceConfig={{ text: 'name', value: '_id' }}
                openOnFocus={true}
                filter={AutoComplete.fuzzyFilter}
                onRequestAdd={this.props.add}
                onRequestDelete={this.props.delete}
            />
        );
    }
}
