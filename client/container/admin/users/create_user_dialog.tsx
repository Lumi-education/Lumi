import * as React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { IUser } from 'lib/types';

interface IStateProps {
    create_user: (name: string) => void;
    close: () => void;
}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {
    name: string;
}

export default class FilterBar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: ''
        };

        this.create_user = this.create_user.bind(this);
    }

    create_user() {
        this.props.create_user(this.state.name);
        this.props.close();
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.props.close}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={this.create_user}
            />
        ];

        return (
            <Dialog
                title="Create User"
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
