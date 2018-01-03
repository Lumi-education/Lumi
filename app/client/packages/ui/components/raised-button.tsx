// modules
import * as React from 'react';

import { RaisedButton } from 'material-ui';

import { state_color } from 'client/style/utils';
// actions
interface IStateProps {
    action: any;
    labels: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    request: 'init' | 'pending' | 'success' | 'error';
}

interface IProps extends IStateProps, IDispatchProps {}

export default class RaisedButtonComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            request: 'init'
        };

        this._click = this._click.bind(this);
        this._label = this._label.bind(this);
    }

    public _click() {
        this.props
            .dispatch(this.props.action)
            .then(res => {
                this.setState({ request: 'success' });
                setTimeout(() => this.setState({ request: 'init' }), 1500);
            })
            .catch(err => this.setState({ request: 'error' }));

        this.setState({ request: 'pending' });
    }

    public _label(): string {
        switch (this.state.request) {
            case 'init':
                return this.props.labels[0];
            case 'pending':
                return this.props.labels[1];
            case 'success':
                return this.props.labels[2];
            case 'error':
                return this.props.labels[3];
        }
    }

    public render() {
        return (
            <RaisedButton
                fullWidth={true}
                primary={true}
                onClick={this._click}
                label={this._label()}
                buttonStyle={{
                    backgroundColor: state_color(this.state.request)
                }}
            />
        );
    }
}
