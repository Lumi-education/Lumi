// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

// components
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import Register from 'lib/auth/components/register';
import { IState } from 'client/state';
import { create_user } from 'lib/users/actions';

interface IStateProps {
    is_installed: boolean;
}

interface IDispatchProps {
    dispatch: (action) => void;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    stepIndex?: number;
    finished?: boolean;
}

export class AdminCollectionCards extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            stepIndex: 0,
            finished: false
        };

        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.getStepContent = this.getStepContent.bind(this);
    }

    public handleNext() {
        const { stepIndex } = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2
        });
    }

    public handlePrev() {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    }

    public getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                    <div>
                        Lumi befindet sich noch in einer sehr frühen
                        Entwicklungsphase. Kontakt & Hilfe:{' '}
                        <a href="https://join.slack.com/t/lumi-education/shared_invite/enQtMjY0MTM2NjIwNDU0LWU3YzVhZjdkNGFjZGE1YThjNzBiMmJjY2I2ODk2MzAzNDE3YzI0MmFkOTdmZWZhOTBmY2RjOTc3ZmZmOWMxY2U">
                            Slack
                        </a>{' '}
                        oder{' '}
                        <a href="mailto:c@Lumi.education">c@Lumi.education</a>
                    </div>
                );
            case 1:
                return (
                    <Register
                        response={0}
                        register={(username, password) => {
                            this.props.dispatch(
                                create_user(username, {
                                    password,
                                    level: 2
                                })
                            );
                        }}
                    />
                );
            case 2:
                return (
                    <div>
                        Die Dokumentation gibt auf{' '}
                        <a href="http://docs.Lumi.education/">
                            docs.Lumi.education
                        </a>
                    </div>
                );
            default:
                return "You're a long way from home sonny jim!";
        }
    }

    public render() {
        const { finished, stepIndex } = this.state;
        const contentStyle = { margin: '0 16px' };

        return (
            <Paper style={{ padding: '20px', margin: '20px' }}>
                <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
                    <Stepper activeStep={stepIndex}>
                        <Step>
                            <StepLabel>Wichtige Informationen</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Admin-Account erstellen</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Fertig!</StepLabel>
                        </Step>
                    </Stepper>
                    <div style={contentStyle}>
                        {finished ? (
                            <p>
                                <a>Anmelden</a>
                            </p>
                        ) : (
                            <div>
                                <p>{this.getStepContent(stepIndex)}</p>
                                <div style={{ marginTop: 12 }}>
                                    <FlatButton
                                        label="Zurück"
                                        disabled={stepIndex === 0}
                                        onClick={this.handlePrev}
                                        style={{ marginRight: 12 }}
                                    />
                                    <RaisedButton
                                        label={
                                            stepIndex === 2
                                                ? 'Fertig'
                                                : 'Weiter'
                                        }
                                        primary={true}
                                        onClick={() => {
                                            stepIndex === 2
                                                ? this.props.push('/')
                                                : this.handleNext();
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Paper>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        is_installed: state.install.is_installed
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        push: (url: string) => dispatch(push(url))
    };
}

export default connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminCollectionCards);
