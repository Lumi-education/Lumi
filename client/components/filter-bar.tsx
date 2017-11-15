import * as React from 'react';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

interface IStateProps {
    filter: string;
}

interface IDispatchProps {
    set_filter: (filter: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export default class FilterBar extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Paper
                zDepth={1}
                style={{
                    position: 'fixed',
                    backgroundColor: '#FFFFFF',
                    top: '64px',
                    zIndex: 1099,
                    width: '100%'
                }}
            >
                <TextField
                    fullWidth={true}
                    value={this.props.filter}
                    hintText="Search"
                    onChange={(e, v) => this.props.set_filter(v)}
                />
            </Paper>
        );
    }
}
