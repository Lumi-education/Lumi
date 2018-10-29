import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import raven from 'lib/core/raven';

import { IState } from 'client/state';

import * as Flow from 'lib/flow';

const log = debug('lumi:client:user:sync');

interface IStateProps {
    unsynced_assignments: Flow.models.Assignment[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class SyncContainer extends React.Component<IProps, IDispatchProps> {
    constructor(props: IProps) {
        super(props);
    }

    public componentDidMount() {
        setInterval(() => {
            if (this.props.unsynced_assignments.length === 0) {
                return;
            }

            const num_assignments = this.props.unsynced_assignments.length;

            log(
                'trying to sync ' +
                    this.props.unsynced_assignments.length +
                    ' assignments',
                this.props.unsynced_assignments
            );

            this.props
                .dispatch(
                    Flow.actions.sync_assignments(
                        this.props.unsynced_assignments
                    )
                )
                .then(res => {
                    if (res.response.status === 200) {
                        raven.captureMessage(
                            num_assignments + ' assignments synced to server.',
                            {
                                level: 'info'
                            }
                        );
                    }
                });
        }, 3000);
    }

    public render() {
        return <div>{this.props.children}</div>;
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        unsynced_assignments: Flow.selectors.unsynced_assignment(state)
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
)(SyncContainer);
