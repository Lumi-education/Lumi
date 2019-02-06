// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// types
import { IState } from 'client/state';

// components

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// modules
import * as Core from 'lib/core';

// steps
import WelcomeStep from './steps/WelcomeStep';
import AccountStep from './steps/AccountStep';
import FinishStep from './steps/FinishStep';

const info = debug('lumi:info:pages:install-page');
const error = debug('lumi:error:pages:install-page');

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    classes: any;
    language: Core.types.Locales;
    system: Core.types.ISystemSettings;

    username_validated: boolean;
    password_validated: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    activeStep: number;

    enable_next: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

function getSteps() {
    return [Core.i18n.t('welcome'), Core.i18n.t('install.account_creation')];
}

export class InstallPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            activeStep: 0,
            enable_next: false
        };
    }

    public componentDidMount() {
        info('componentDidMount');
        this.props.dispatch(Core.actions.get_settings());
    }

    public handleNext = () => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep + 1,
            enable_next: false
        });
    };

    public handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1
        }));
    };

    public handleReset = () => {
        this.setState({
            activeStep: 0
        });
    };

    public getStepContent = step => {
        switch (step) {
            case 0:
                return (
                    <WelcomeStep
                        enable_next={(value: boolean) =>
                            this.setState({ enable_next: value })
                        }
                    />
                );
            case 1:
                return <AccountStep />;
            //     return 'What is an ad group anyways?';
            // case 2:
            //     return 'This is the bit I really care about!';
            default:
                return 'Unknown step';
        }
    };

    public componentDidUpdate(prevProps: IProps, prevState: IComponentState) {
        if (
            this.props.password_validated &&
            this.props.username_validated &&
            !this.state.enable_next
        ) {
            this.setState({ enable_next: true });
        }
    }

    public render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;
        return (
            <Core.components.GradientBackground>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Lumi
                        </Typography>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const props = {};
                                const labelProps = {};

                                return (
                                    <Step key={label} {...props}>
                                        <StepLabel {...labelProps}>
                                            {label}
                                        </StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        <div>
                            {activeStep === steps.length ? (
                                <FinishStep />
                            ) : (
                                <div>
                                    {this.getStepContent(activeStep)}
                                    <div className={classes.buttons}>
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={this.handleBack}
                                            className={classes.button}
                                        >
                                            {Core.i18n.t('back')}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleNext}
                                            className={classes.button}
                                            disabled={!this.state.enable_next}
                                        >
                                            {activeStep === steps.length - 1
                                                ? Core.i18n.t('finish')
                                                : Core.i18n.t('next')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Paper>
                </main>
            </Core.components.GradientBackground>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        language: state.i18n.locale,
        system: state.core.system,
        username_validated: state.auth.username_validated,
        password_validated: Boolean(state.auth.password)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}
const styles: StyleRulesCallback = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    paper: {
        // marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            // marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3
        }
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(InstallPage)
);
