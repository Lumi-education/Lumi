import * as React from 'react';

// components
import TextField from 'material-ui/TextField';

// types
import { ICollection } from 'common/types';

interface IProps {
    collection: ICollection;
}

export default class CollectionEditComponent extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const collection = this.props.collection;
        return (
            <div>
                <TextField value={collection.name} fullWidth={true} />
                <TextField value={collection.description} fullWidth={true} />
            </div>
        );
    }
}
