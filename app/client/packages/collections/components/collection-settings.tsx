import * as React from 'react';

// components
import TextField from 'material-ui/TextField';
import { TagInputContainer } from 'client/packages/tags';
import RaisedButton from 'material-ui/RaisedButton';

// types
import { ICollection } from 'common/types';

interface IProps {
    collection: ICollection;
    update: (update) => void;
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

    public componentReceiveProps(nextProps: IProps) {
        this.setState(this.props.collection);
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
                    onClick={() => this.props.update(this.state)}
                    style={{ margin: '20px' }}
                    primary={true}
                    label="save"
                />
            </div>
        );
    }
}
