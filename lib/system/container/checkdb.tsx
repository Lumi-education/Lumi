// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { noop } from 'lodash';

import { IState } from '../types';
import { checkDb } from 'lib/system/actions';

// local

interface IDispatchProps {
    dispatch: (action) => any;
}

export class CheckDB extends React.Component<IDispatchProps, {}> {
    constructor(props: IDispatchProps) {
        super(props);
    }

    public componentWillMount() {
        this.props
            .dispatch(checkDb(window.location.pathname.split('/')[1]))
            .then(
                res =>
                    res.response.status !== 200
                        ? this.props.dispatch(push('/'))
                        : noop()
            );
    }

    public render() {
        return <div>{this.props.children}</div>;
    }
}

function mapStateToProps(state: IState, ownProps: {}): {} {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    CheckDB
);
