// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import * as debug from 'debug';

import { Dialog, Paper, TextField, RaisedButton } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Core from 'lib/core';

const log = debug('lumi:modules:admin:cards:cards-page');

interface IStateProps {
    env: any;
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

export class SystemIndex extends React.Component<IProps, IComponentState> {
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
        this.props.dispatch(Core.actions.get_env());
    }

    public render() {
        const env = assign({}, this.props.env, this.state.env);

        const env_components = [];
        for (const key in env) {
            env_components.push(
                <TextField
                    onChange={(e, v) => {
                        const o = {};
                        o[key] = v;
                        this.setState({ env: assign({}, this.state.env, o) });
                    }}
                    key={key}
                    floatingLabelText={key}
                    errorText={
                        this.props.env[key] !== env[key]
                            ? 'was: ' + this.props.env[key]
                            : null
                    }
                    value={env[key]}
                    fullWidth={true}
                />
            );
        }
        return (
            <div style={{}}>
                <Dialog
                    open={this.state.dialog_open}
                    onRequestClose={() => this.setState({ dialog_open: false })}
                >
                    <TextField
                        fullWidth={true}
                        floatingLabelText="Key"
                        value={this.state.new_field_key}
                        onChange={(e, v) => this.setState({ new_field_key: v })}
                    />
                    <TextField
                        fullWidth={true}
                        floatingLabelText="Value"
                        value={this.state.new_field_value}
                        onChange={(e, v) =>
                            this.setState({ new_field_value: v })
                        }
                    />
                    <RaisedButton
                        primary={true}
                        fullWidth={true}
                        onClick={() => {
                            const o = {};
                            o[
                                this.state.new_field_key
                            ] = this.state.new_field_value;
                            this.setState({
                                env: assign({}, this.state.env, o),
                                dialog_open: false
                            });
                        }}
                        label={Core.i18n.t('save')}
                    />
                    <RaisedButton
                        fullWidth={true}
                        label={Core.i18n.t('cancel')}
                        onClick={() => this.setState({ dialog_open: false })}
                    />
                </Dialog>
                <Paper style={{ margin: '20px' }}>
                    {env_components}
                    <RaisedButton
                        secondary={true}
                        fullWidth={true}
                        label={Core.i18n.t('add_new_field')}
                        onClick={() => this.setState({ dialog_open: true })}
                    />
                    <RaisedButton
                        primary={true}
                        fullWidth={true}
                        label={Core.i18n.t('save_and_reboot')}
                        onClick={() =>
                            this.props.dispatch(
                                Core.actions.update_env(
                                    assign({}, this.props.env, this.state.env)
                                )
                            )
                        }
                    />
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        env: state.core.status.env
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
)(SystemIndex);
