import * as React from 'react';

// components
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

// types
import { ICollection } from 'common/types';

interface IStateProps {
    collections: ICollection[];
}

interface IDispatchProps {
    onClick: (id: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class CollectionListComponent extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <List>
                {this.props.collections.map(collection => (
                    <div>
                        <ListItem
                            leftAvatar={
                                <Avatar>
                                    {collection.name.substring(0, 3)}
                                </Avatar>
                            }
                            primaryText={collection.name}
                            secondaryText={collection.description}
                            onClick={() => this.props.onClick(collection._id)}
                        />
                        <Divider inset={true} />
                    </div>
                ))}
            </List>
        );
    }
}
