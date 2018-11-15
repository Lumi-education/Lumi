// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';
import * as debug from 'debug';

// types
import { IState } from 'client/state';

// components
import { CardList } from 'client/components';
import { UserSettingsContainer } from 'client/container';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Close';
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
}

interface IProps extends IStateProps, IDispatchProps {}

export class InstallPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            admin_username: '',
            language: 'en'
        };
    }

    public componentWillMount() {
        info('componentWillMount');
    }

    public render() {
        const { classes } = this.props;
        return (
            <div className={classes.page}>
                <div className={classes.contentContainer}>
                    <Paper className={classes.paper}>
                        {' '}
                        <Typography variant="h5" component="h3">
                            {Core.i18n.t('welcome')}
                        </Typography>
                        <TextField
                            id="outlined-name"
                            label={Core.i18n.t('name')}
                            className={classes.textField}
                            value={this.state.admin_username}
                            onChange={e =>
                                this.setState({
                                    admin_username: e.target.value
                                })
                            }
                            margin="normal"
                            variant="outlined"
                        />
                        <FormControl
                            variant="outlined"
                            className={classes.formControl}
                        >
                            <InputLabel htmlFor="outlined-age-native-simple">
                                {Core.i18n.t('language')}
                            </InputLabel>
                            <Select
                                native={true}
                                value={this.state.language}
                                onChange={e => {
                                    this.props.dispatch(
                                        setLocale(e.target.value)
                                    );
                                    this.setState({ language: e.target.value });
                                }}
                                input={
                                    <OutlinedInput
                                        name={Core.i18n.t('language')}
                                        labelWidth={200}
                                        id="outlined-age-native-simple"
                                    />
                                }
                            >
                                <option value={'de'}>Deutsch</option>
                                <option value={'en'}>English</option>
                            </Select>
                        </FormControl>
                        <div className={classes.buttons}>
                            <UI.components.RaisedButton
                                action={Core.actions.install_admin(
                                    this.state.admin_username,
                                    this.state.language
                                )}
                                labels={[
                                    Core.i18n.t('save'),
                                    Core.i18n.t('saving'),
                                    Core.i18n.t('saved'),
                                    Core.i18n.t('error')
                                ]}
                                disabled={false}
                                fullWidth={false}
                                className={classes.submit}
                                onSuccess={res => {
                                    info('Save-Button success', res);
                                    this.props.dispatch(
                                        Auth.actions.login(
                                            this.state.admin_username,
                                            'test'
                                        )
                                    );

                                    this.props.dispatch(
                                        Core.actions.get_settings()
                                    );
                                }}
                            />
                        </div>
                    </Paper>
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
    page: {
        height: '100vh',
        background: 'linear-gradient(45deg, #1abc9c 0%, #3498db 100%)'
    },
    contentContainer: {
        maxWidth: '680px',
        margin: 'auto'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit *
            3}px ${theme.spacing.unit * 3}px`
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
