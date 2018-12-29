import * as React from 'react';
import { connect } from 'react-redux';
import raven from 'lib/core/raven';
import * as debug from 'debug';

import { IState } from 'lib/core/types';

import * as Core from 'lib/core';
import * as DB from 'lib/db';

import Auth from './auth';
import InstallPage from './install-page';

const log = debug('lumi:pages:root');

interface IStateProps {
    connected: boolean;
    installed: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}
interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class RootContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Core.actions.get_settings());
    }

    public render() {
        return (
            <div id="root">
                <DB.container.db>
                    {this.props.installed ? <Auth /> : <InstallPage />}
                </DB.container.db>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        connected: state.core.status.connected,
        installed: state.core.system.installed
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
)(RootContainer);
