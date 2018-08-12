// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { RaisedButton } from 'material-ui';

import { state_color } from '../utils';

import * as UI from '../';

// actions
interface IPassedProps {
    action: any;
    labels: string[];
    onSuccess?: () => void;
    disabled: boolean;
    fullWidth: boolean;
}

interface IStateProps extends IPassedProps {}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    request: 'init' | 'pending' | 'success' | 'error';
}

interface IProps extends IStateProps, IDispatchProps {}

export class RaisedButtonContainer extends React.Component<
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
                this.props.onSuccess();
                setTimeout(() => this.setState({ request: 'init' }), 3000);
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
                disabled={this.props.disabled}
                fullWidth={this.props.fullWidth}
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

function mapStateToProps(state: UI.IState, ownProps): IStateProps {
    return {
        disabled: ownProps.disabled,
        action: ownProps.action,
        labels: ownProps.labels,
        onSuccess: ownProps.onSuccess,
        fullWidth: ownProps.fullWidth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(RaisedButtonContainer);
