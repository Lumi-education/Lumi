import * as React from 'react';

// components
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

// container
import TagListItemContainer from '../container/tag-list-item';
// types
import { ITag } from 'common/types';

interface IStateProps {
    tags: ITag[];
}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}
interface IState {}

export default class TagListComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <List>
                {this.props.tags.map(tag => (
                    <TagListItemContainer tag_id={tag._id} />
                ))}
            </List>
        );
    }
}
