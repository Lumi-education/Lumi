// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import * as semver from 'semver';

import { Paper } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';

const log = debug('lumi:modules:admin:cards:cards-page');

interface IStateProps {
    update: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    loading?: string;
    loading_step?: number;
    env?: any;
    dialog_open?: boolean;
    new_field_key?: string;
    new_field_value?: string;
}

export class SystemUpdateTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 'init',
            loading_step: 0,
            env: {},
            dialog_open: false,
            new_field_key: '',
            new_field_value: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(Core.actions.check_update());
    }

    public render() {
        const system_version = semver.coerce(process.env.VERSION).version;
        const update_version = semver.coerce(this.props.update.tag_name)
            .version;

        return (
            <div id="lumi_admin_system_update" style={{}}>
                <Paper style={{ margin: '20px', padding: '15px' }}>
                    {semver.lt(system_version, update_version) ? (
                        <div>
                            <h1>
                                {Core.i18n.t('update-available', {
                                    name: this.props.update.tag_name
                                })}
                            </h1>
                            <h2>{this.props.update.name}</h2>
                            {this.props.update.body}
                        </div>
                    ) : (
                        <div>
                            <h1> {Core.i18n.t('lumi_is_up_to_date')}</h1>
                        </div>
                    )}
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        update: state.core.status.update
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(SystemUpdateTab);
