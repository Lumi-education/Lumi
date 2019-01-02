// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';
import * as debug from 'debug';

// types
import { IState } from 'client/state';
import Particles from 'react-particles-js';

// components

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Auth from 'lib/auth';

const info = debug('lumi:info:pages:install-page');
const error = debug('lumi:error:pages:install-page');

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
    admin_username: string;
    language: string;
    password: string;
    password_repeat: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class InstallPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            admin_username: '',
            password: '',
            password_repeat: '',
            language: 'en'
        };
    }

    public componentWillMount() {
        info('componentWillMount');
    }

    public render() {
        const { classes } = this.props;
        return (
            <div>
                <Particles
                    style={{ position: 'fixed' }}
                    params={{
                        particles: {
                            number: {
                                value: 42
                            },
                            size: {
                                value: 3
                            }
                        },
                        interactivity: {
                            events: {
                                onhover: {
                                    enable: true,
                                    mode: 'repulse'
                                }
                            }
                        }
                    }}
                />
                <div className={classes.background}>
                    <main className={classes.main} />
                </div>
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
    background: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: theme.palette.background.default
    },
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(InstallPage)
);
