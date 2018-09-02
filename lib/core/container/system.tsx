import * as React from 'react';
import { connect } from 'react-redux';
import raven from 'lib/core/raven';
import * as debug from 'debug';

import { IState } from '../types';

import * as Core from '..';
import * as UI from '../../ui';

const log = debug('lumi:lib:core:system-container');

interface IStateProps {
    connected: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}
interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading?: boolean;
    loading_step?: number;
}

export class SystemSettingsContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            loading_step: 0
        };
    }

    public componentDidMount() {
        this.setState({ loading_step: 1 });
        this.props.dispatch(Core.actions.get_settings()).then(res => {
            this.setState({ loading: false, loading_step: 2 });

            setInterval(() => {
                this.props.dispatch(Core.actions.ping());
            }, 5000);
        });
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (!this.props.connected && nextProps.connected) {
            raven.captureMessage('Connection was lost.', { level: 'info' });
        }
    }

    public render() {
        return this.state.loading ? (
            <UI.components.LoadingPage
                min={0}
                max={2}
                value={this.state.loading_step}
            >
                Lumi
            </UI.components.LoadingPage>
        ) : (
            <div id="system">{this.props.children}</div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        connected: state.core.status.connected
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(SystemSettingsContainer);
