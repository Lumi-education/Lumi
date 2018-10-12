import * as React from 'react';
import { connect } from 'react-redux';
import raven from 'lib/core/raven';

// material-ui
import { Paper, Dialog, TextField, RaisedButton } from 'material-ui';

import { state_color } from 'lib/ui/utils';

import * as Auth from '../';
import * as UI from 'lib/ui';

interface IStateProps {
    username: string;
    password: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    password?: string;
    password_repeat?: string;
}

export class CaptiveContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        try {
            return (
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                    className="bg"
                >
                    <div>
                        <a href="http://10.0.0.1" target="_system">
                            <Paper zDepth={2}>
                                <RaisedButton
                                    fullWidth={true}
                                    label={'Bitte hier klicken.'}
                                    style={{
                                        borderRadius: '6px'
                                    }}
                                />
                            </Paper>
                        </a>
                    </div>
                </div>
            );
        } catch (err) {
            raven.captureException(err);
        }
    }
}

function mapStateToProps(state: Auth.IState, ownProps: {}): IStateProps {
    return {
        username: state.auth.username,
        password: state.auth.password
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
)(CaptiveContainer);
