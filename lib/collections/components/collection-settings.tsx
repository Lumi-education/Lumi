import * as React from 'react';
import * as debug from 'debug';

// components
import TextField from 'material-ui/TextField';
import { TagInputContainer } from 'lib/tags';
import RaisedButton from 'material-ui/RaisedButton';

// types
import { ICollection } from 'lib/collections/types';

const log_props = debug(
    'lumi:props:collections:components:collection-settings'
);

interface IProps {
    collection: ICollection;
    update: (update) => void;
    cancel: () => void;
    delete: () => void;
}

interface IState {
    name?: string;
    description?: string;
}

export default class CollectionEditComponent extends React.Component<
    IProps,
    IState
> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.setState(this.props.collection);
    }

    public componentWillReceiveProps(nextProps: IProps) {
        log_props('receiving new props', nextProps);
        this.setState(nextProps.collection);
    }

    public render() {
        const { name, description } = this.state;
        return (
            <div>
                <TextField
                    onChange={(e, v) => this.setState({ name: v })}
                    value={name}
                    fullWidth={true}
                />
                <TextField
                    onChange={(e, v) => this.setState({ description: v })}
                    value={description}
                    fullWidth={true}
                />
                <TagInputContainer doc_id={this.props.collection._id} />
                <RaisedButton
                    onClick={() => this.props.cancel()}
                    style={{ margin: '20px' }}
                    label="cancel"
                />
                <RaisedButton
                    onClick={() => this.props.delete()}
                    style={{ margin: '20px' }}
                    secondary={true}
                    label="delete"
                />
                <RaisedButton
                    onClick={() => this.props.update(this.state)}
                    style={{ margin: '20px' }}
                    primary={true}
                    label="save"
                />
            </div>
        );
    }
}
