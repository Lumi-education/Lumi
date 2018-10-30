import * as React from 'react';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import * as Core from 'lib/core';

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
            <TextField
                id="search"
                fullWidth={true}
                value={this.props.filter}
                hintText={Core.i18n.t('search')}
                onChange={(e, v) => this.props.set_filter(v)}
            />
        );
    }
}
