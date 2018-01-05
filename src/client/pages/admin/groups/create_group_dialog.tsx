import * as React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { IGroup } from 'lib/groups';

interface IProps {
    create_group: (name: string) => void;
    close: () => void;
}

interface IState {
    name: string;
}

export default class CreateGroupDialog extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: ''
        };

        this.create_group = this.create_group.bind(this);
    }

    public create_group() {
        this.props.create_group(this.state.name);
        this.props.close();
    }

    public render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.props.close}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={this.create_group}
            />
        ];

        return (
            <Dialog
                title="Create Group"
                actions={actions}
                modal={true}
                open={true}
            >
                <TextField
                    hintText="Name"
                    value={this.state.name}
                    onChange={(e, v) => this.setState({ name: v })}
                    fullWidth={true}
                />
            </Dialog>
        );
    }
}
