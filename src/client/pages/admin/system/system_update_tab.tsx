// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import { assign } from 'lodash';
import * as debug from 'debug';
import * as semver from 'semver';

import {
    Card,
    CardHeader,
    Avatar,
    Dialog,
    Paper,
    TextField,
    RaisedButton
} from 'material-ui';

import * as moment from 'moment-timezone';

// svg
import SVGAssignmentTurnedIn from 'material-ui/svg-icons/action/assignment-turned-in';
import SVGLogin from 'material-ui/svg-icons/action/input';
import SVGDefault from 'material-ui/svg-icons/action/info';
import SVGComment from 'material-ui/svg-icons/communication/comment';

// local
import { IState } from 'client/state';

// selectors
import * as Activity from 'lib/activity';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
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
    // filter?: string[];
    // search_text?: string;
    // new_tag_name?: string;
    // new_tag_description?: string;
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

        if (this.props.update.request_status === 'pending') {
            return (
                <UI.components.LoadingPage>Updates</UI.components.LoadingPage>
            );
        }
        if (this.props.update.request_status === 'error') {
            return (
                <UI.components.ErrorPage>
                    Keine Internet-Verbindung
                </UI.components.ErrorPage>
            );
        }
        return (
            <div id="lumi_admin_system_update" style={{}}>
                <Paper style={{ margin: '20px', padding: '15px' }}>
                    {semver.lt(system_version, update_version) ? (
                        <div>
                            <h1>
                                Update {this.props.update.tag_name} verfügbar
                            </h1>
                            <h2>{this.props.update.name}</h2>
                            {this.props.update.body}
                            <UI.components.RaisedButton
                                action={Core.actions.update_system()}
                                labels={[
                                    'Update',
                                    'lade...',
                                    'Update wird durchgeführt',
                                    'Fehler'
                                ]}
                                disabled={false}
                                fullWidth={true}
                            />
                        </div>
                    ) : (
                        <div>
                            <h1>Lumi ist auf dem neusten Stand. </h1>
                        </div>
                    )}
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        update: state.core.system.update
        //
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
