// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import PouchDB from 'pouchdb';

import { IState } from 'client/state';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as DB from '../';
import * as Core from 'lib/core';

import db from '../db';

const log_info = debug('lumi:info:db:container:db');
const log_error = debug('lumi:error:db:container:db');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    pending_docs: number;
    initial_docs: number;
    state: DB.types.DBState;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class SyncProgressContainer extends React.Component<
    IProps,
    IComponentState
> {
    public remote_db: PouchDB;

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (this.props.state === 'active') {
            return <LinearProgress />;
        }
        return this.props.pending_docs === 0 ? null : (
            <LinearProgress
                variant="determinate"
                value={
                    ((this.props.initial_docs - this.props.pending_docs) /
                        this.props.initial_docs) *
                    100
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        pending_docs: state.db.pending_docs,
        initial_docs: state.db.initial_docs,
        state: state.db.state
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
)(SyncProgressContainer);
