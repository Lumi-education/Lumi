// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import raven from 'lib/core/raven';

import { RaisedButton } from 'material-ui';
import { state_color } from '../utils';

import * as Core from 'lib/core';
import * as UI from '..';

// actions
interface IPassedProps {
    action: any;
    labels: string[];
    onSuccess?: (res?: any) => void;
    disabled: boolean;
    fullWidth: boolean;
    className?: string;
}

interface IStateProps extends IPassedProps {}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    request: 'init' | 'pending' | 'success' | 'error';
    message: string;
}

interface IProps extends IStateProps, IDispatchProps {}

const info = debug('lumi:info:lib:ui:components:raised-button');
const error = debug('lumi:error:lib:ui:components:raised-button');

export class RaisedButtonContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            request: 'init',
            message: null
        };

        this._click = this._click.bind(this);
        this._label = this._label.bind(this);
    }

    public _click() {
        this.props
            .dispatch(this.props.action)
            .then(action => {
                const action_type = action.type.split('_')[
                    action.type.split('_').length - 1
                ];
                switch (action_type) {
                    case 'SUCCESS':
                        this.setState({ request: 'success' });
                        if (this.props.onSuccess) {
                            this.props.onSuccess(action);
                        }
                        break;
                    case 'ERROR':
                        throw new Error(action.type);
                }

                setTimeout(() => this.setState({ request: 'init' }), 2000);
            })
            .catch(err => {
                error('_click', err);
                raven.captureException(err);
                this.setState({
                    message: err.message || 'error',
                    request: 'error'
                });
                setTimeout(() => this.setState({ request: 'init' }), 2000);
            });

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
                return this.state.message
                    ? Core.i18n.t(this.state.message)
                    : this.props.labels[3];
        }
    }

    public render() {
        return (
            <RaisedButton
                disabled={this.props.disabled}
                className={this.props.className}
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
        fullWidth: ownProps.fullWidth,
        className: ownProps.className
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
