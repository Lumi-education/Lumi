// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import PouchDB from 'pouchdb';

import { IState } from 'client/state';

import * as DB from '../';
import * as Core from 'lib/core';

import db from '../db';

const log_info = debug('lumi:info:db:container:db');
const log_error = debug('lumi:error:db:container:db');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    db_name: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading: boolean;
}

export class DBContainer extends React.Component<IProps, IComponentState> {
    public remote_db: PouchDB;

    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };

        this.sync = this.sync.bind(this);
        this.push_to_store = this.push_to_store.bind(this);
    }

    public sync() {
        log_info('sync start');
        PouchDB.sync(db, this.remote_db, {
            live: true,
            retry: true
        })
            .on('change', changes => {
                log_info('changes', changes);
                this.props.dispatch(DB.actions.change(changes.change.docs));
            })
            .on('paused', error => {
                log_info('paused', error);
                this.props.dispatch(DB.actions.paused(error));
            })
            .on('active', () => {
                log_info('active');
                this.props.dispatch(DB.actions.active());
            })
            .on('denied', error => {
                log_error('denied', error);
                this.props.dispatch(DB.actions.denied(error));
            })
            .on('complete', info => {
                log_info('complete', info);
                this.props.dispatch(DB.actions.complete(info));
            })
            .on('error', error => {
                log_error('error', error);
                this.props.dispatch(DB.actions.error(error));
                Core.raven.captureExceoption(error);
            });
    }

    public push_to_store() {
        log_info('push_to_store');
        db.allDocs({ include_docs: true })
            .then(docs => {
                log_info('push_to_store', docs);
                const _docs = docs.rows
                    .map(row => row.doc)
                    .filter(doc => doc.type);
                this.props.dispatch(DB.actions.change(_docs));
                log_info('all docs pushed to store');
                this.setState({ loading: false });
            })
            .catch(error => {
                Core.raven.captureExceoption(error);
                this.props.dispatch(DB.actions.error(error));
            });
    }

    public componentWillMount() {
        log_info('componentWillMount');
        log_info(this.props.db_name);

        this.remote_db = new PouchDB(
            `${window.location.origin}/api/v1/${this.props.db_name}`,
            {
                fetch: (url, opts) => {
                    opts.headers.set('x-auth', window.localStorage.jwt_token);
                    return PouchDB.fetch(url, opts);
                },
                skip_setup: true
            }
        );

        db.replicate
            .from(this.remote_db, {
                retry: true
            })
            .on('change', changes => {
                log_info('changes', changes);
                this.props.dispatch(DB.actions.change(changes.docs));
                this.props.dispatch(DB.actions.pending_docs(changes.pending));
            })
            .on('paused', error => {
                log_info('paused', error);
                this.props.dispatch(DB.actions.paused(error));
            })
            .on('active', () => {
                log_info('active');
                this.props.dispatch(DB.actions.active());
            })
            .on('denied', error => {
                log_error('denied', error);
                this.props.dispatch(DB.actions.denied(error));
            })
            .on('complete', info => {
                log_info('complete', info);
                this.props.dispatch(DB.actions.complete(info));
                this.props.dispatch(DB.actions.pending_docs(0));
                this.sync();
            })
            .on('error', error => {
                log_error('error', error);
                this.props.dispatch(DB.actions.error(error));
                Core.raven.captureExceoption(error);
            });

        this.push_to_store();
    }

    public render() {
        if (this.state.loading) {
            return (
                <Core.components.GradientBackground>
                    <Core.components.Content>Loading</Core.components.Content>
                </Core.components.GradientBackground>
            );
        }
        return this.props.children;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        db_name: DB.selectors.db_name(state)
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
)(DBContainer);
