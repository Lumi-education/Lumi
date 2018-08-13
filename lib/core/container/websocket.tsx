import * as React from 'react';
import { connect } from 'react-redux';

import * as socketio from 'socket.io-client';

import * as Core from '..';

declare var window;

interface IStateProps {
    changes_port: number;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class WebsocketContainer extends React.Component<
    IProps,
    IDispatchProps
> {
    constructor(props: IProps) {
        super(props);
    }

    public componentDidMount() {
        let socket;
        socket = socketio.connect(
            'http://' +
                window.location.hostname +
                ':' +
                this.props.changes_port,
            {
                query: { jwt_token: window.localStorage.jwt_token }
            }
        );

        socket.on('DB_CHANGE', msg => {
            const action = JSON.parse(msg);
            this.props.dispatch(action);
        });
    }

    public render() {
        return <div>{this.props.children}</div>;
    }
}

function mapStateToProps(state: Core.IState, ownProps: {}): IStateProps {
    return {
        changes_port: Core.selectors.system_settings(state).changes_port
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
)(WebsocketContainer);
