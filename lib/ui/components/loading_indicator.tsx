import * as React from 'react';

import { LinearProgress } from 'material-ui';

import * as UI from '../';

interface IStateProps {
    min?: number;
    max?: number;
    value?: number;
}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

export default class LoadingIndicator extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <LinearProgress
                color="#8e44ad"
                mode="indeterminate"
                value={this.props.value}
                min={this.props.min}
                max={this.props.max}
            />
        );
    }
}
