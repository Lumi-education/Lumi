// modules
import * as React from 'react';
import { Map } from 'immutable';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import { ITag } from 'common/types';

interface IStateProps {
    tags: Map<string, ITag>;
    tag_id: string;
}

interface IDispatchProps {
    delete?: (event) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class Tag extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const tag = this.props.tags.get(this.props.tag_id, {
            _id: undefined,
            name: 'tag not found',
            type: 'tag',
            short_name: 'err',
            description: 'this tag was not found',
            color: 'red',
            created_at: new Date()
        });

        return (
            <Chip
                backgroundColor={tag.color}
                onRequestDelete={this.props.delete}
            >
                <Avatar size={32}>
                    {tag.short_name || tag.name.substring(0, 3)}
                </Avatar>
                {tag.name}
            </Chip>
        );
    }
}