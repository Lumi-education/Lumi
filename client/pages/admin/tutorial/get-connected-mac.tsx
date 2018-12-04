// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { IState } from 'client/state';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Cards from 'lib/cards';
import * as UI from 'lib/ui';

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    classes: any;
    language: Core.types.Locales;
    system: Core.types.ISystemSettings;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    activeStep: number;
    skipped: any;
}

interface IProps extends IStateProps, IDispatchProps {}

const steps = ['tutorial_open_wifi', 'get_connected', 'next_steps'];

function getStepContent(language: Core.types.Locales, step: number) {
    switch (language) {
        case 'de':
            switch (step) {
                case 0:
                    return <div>Hallo</div>;
                case 1:
                    return 'setup Lumi';
                case 2:
                    return 'go';
                default:
                    return 'Unknown step';
            }

        case 'en':
        default:
            switch (step) {
                case 0:
                    return (
                        <div>
                            <Typography variant="h5" component="h3">
                                Open a Wifi-Hotspot
                            </Typography>
                            <Grid container={true} spacing={24}>
                                <Grid item={true} xs={7}>
                                    <Typography
                                        variant="body2"
                                        gutterBottom={true}
                                    >
                                        1. Click on the WiFi-Icon in the
                                        Menubar.
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={5}>
                                    <img src="/static/tutorial/open_wifi_1.png" />
                                </Grid>
                                <Grid item={true} xs={7}>
                                    <Typography
                                        variant="body2"
                                        gutterBottom={true}
                                    >
                                        2. Select the "Create Network..."-item
                                        from the menu.
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={5}>
                                    <img src="/static/tutorial/open_wifi_2.png" />
                                </Grid>
                                <Grid item={true} xs={7}>
                                    <Typography
                                        variant="body2"
                                        gutterBottom={true}
                                    >
                                        3. Enter a name for your Wifi-Network
                                        and click on "Create".
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={5}>
                                    <img src="/static/tutorial/open_wifi_3.png" />
                                </Grid>
                                <Grid item={true} xs={12}>
                                    <Typography
                                        variant="body2"
                                        gutterBottom={true}
                                    >
                                        4. A WiFi-Network with your choosen name
                                        is being created. This network can be
                                        joined by students or users in order to
                                        connect to Lumi.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    );
                case 1:
                    return (
                        <div>
                            <Typography variant="h5" component="h3">
                                Get connected
                            </Typography>
                            <Grid container={true} spacing={24}>
                                <Grid item={true} xs={12}>
                                    <Typography
                                        variant="body2"
                                        gutterBottom={true}
                                    >
                                        1. Connect mobile devices by simply
                                        joining the newly created WiFi-Network
                                        with your choosen name. Your mobile
                                        device might tell you that there is no
                                        internet-connection, but that does not
                                        bother us.
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={12}>
                                    <Typography
                                        variant="body2"
                                        gutterBottom={true}
                                    >
                                        2. Open a webbrowser (Chrome or Google,
                                        Safari, etc) on your mobile device and
                                        navigate to the address-field. Enter the
                                        Lumi-address provided on the{' '}
                                        <a
                                            href="/admin/dashboard"
                                            target="_blank"
                                        >
                                            Dasboard
                                        </a>
                                        -Page.
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={12}>
                                    <Typography
                                        variant="body2"
                                        gutterBottom={true}
                                    >
                                        3. The Lumi-Login-page should pop up.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    );
                case 2:
                    return 'go';
                default:
                    return 'Unknown step';
            }
    }
}

export class TutorialPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            activeStep: 0,
            skipped: []
        };

        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    public handleNext() {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep + 1
        });
    }

    public handleBack() {
        this.setState(state => ({
            activeStep: state.activeStep - 1
        }));
    }

    public handleReset() {
        this.setState({
            activeStep: 0
        });
    }

    public render() {
        const { classes } = this.props;
        const { activeStep } = this.state;
        return (
            <div className={classes.contentContainer}>
                <Paper className={classes.paper}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((step, index) => {
                            return (
                                <Step
                                    key={index}
                                    completed={index < activeStep}
                                >
                                    <StepLabel>{Core.i18n.t(step)}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <Typography className={classes.instructions}>
                        {getStepContent(this.props.language, activeStep)}
                    </Typography>
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
                    >
                        {activeStep === steps.length - 1
                            ? Core.i18n.t('finish')
                            : Core.i18n.t('next')}
                    </Button>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        language: state.i18n.locale,
        system: state.core.system
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    root: {
        width: '90%'
    },
    button: {
        marginRight: theme.spacing.unit
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        padding: 20
    },
    contentContainer: {
        paddingTop: '40px',
        maxWidth: '680px',
        margin: 'auto'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    paper: {
        display: 'flex',
        flexDirection: 'column'
    },
    dense: {
        marginTop: 16
    },
    menu: {
        width: 200
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(TutorialPage)
);
