// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as debug from 'debug';
import { AppBar, Paper, TextField, RaisedButton } from 'material-ui';

import { checkDb } from 'client/packages/system/actions';

// local
import { IState } from '../state';

const log = debug('lumi:modules:db-route');

interface IStateProps {
    userlevel: number;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    lumi_id?: string;
    request?: 'init' | 'pending' | 'success' | 'error';
}

export class DBRoute extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            lumi_id: '',
            request: 'init'
        };

        this.handleGo = this.handleGo.bind(this);
    }

    public handleGo(e) {
        this.setState({ request: 'pending' });
        this.props
            .dispatch(checkDb(this.state.lumi_id))
            .then(res => {
                if (res.response.status !== 200) {
                    throw new Error('db not found');
                }
                this.setState({ request: 'success' });
                this.props.dispatch(
                    push('/' + this.state.lumi_id.toLowerCase())
                );
            })
            .catch(err => this.setState({ request: 'error' }));
    }

    public render() {
        return (
            <div
                style={{
                    background: 'linear-gradient(230deg, #4b79cf, #4bc5cf)',
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <div
                    style={{
                        margin: 'auto',
                        maxWidth: '400px'
                    }}
                >
                    <Paper
                        style={{
                            padding: '10px'
                        }}
                    >
                        <TextField
                            value={this.state.lumi_id}
                            onChange={(e, v) => {
                                this.setState({
                                    lumi_id: v
                                        .toLowerCase()
                                        .replace(/[^a-zA-Z0-9]/g, ''),
                                    request: 'init'
                                });
                            }}
                            onKeyDown={e => {
                                if (e.keyCode === 13) {
                                    this.handleGo(e);
                                }
                            }}
                            hintText="Lumi ID"
                            errorText={
                                this.state.request === 'error'
                                    ? 'Lumi ID ' +
                                      this.state.lumi_id +
                                      ' not found'
                                    : null
                            }
                            fullWidth={true}
                        />
                        <RaisedButton
                            onClick={this.handleGo}
                            primary={true}
                            fullWidth={true}
                            label="GO!"
                        />
                    </Paper>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        userlevel: state.auth.userlevel
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    DBRoute
);
