import * as React from 'react';
import { connect } from 'react-redux';

import * as socketio from 'socket.io-client';

import { IState } from '../types';
import * as System from 'lib/system';

declare var window;

interface IProps {
    dispatch: (action) => any;
}

export class WebsocketContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentDidMount() {
        let socket;
        this.props.dispatch(System.actions.get_settings()).then(res => {
            socket = socketio.connect(
                'http://' +
                    window.location.hostname +
                    ':' +
                    res.payload.changes_port,
                {
                    query: { jwt_token: window.localStorage.jwt_token }
                }
            );

            socket.on('DB_CHANGE', msg => {
                const action = JSON.parse(msg);
                this.props.dispatch(action);
            });
        });
    }

    public render() {
        return <div>{this.props.children}</div>;
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
    WebsocketContainer
);
