import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from '../types';
import * as System from '../';

declare var window;

interface IProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading: boolean;
}

export class SystemSettingsContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    public componentDidMount() {
        this.props.dispatch(System.actions.get_settings()).then(res => {
            this.setState({ loading: false });
        });
    }

    public render() {
        return this.state.loading ? (
            <div id="system"> Loading </div>
        ) : (
            <div id="system">{this.props.children}</div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}) {
    return {};
}

function mapDispatchToProps(dispatch): IProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    SystemSettingsContainer
);
