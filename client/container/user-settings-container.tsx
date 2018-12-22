// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';

// types
import { IState } from 'client/state';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Typography from '@material-ui/core/Typography';

import { GroupsChipInputContainer } from 'client/container';

import * as Core from 'lib/core';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    user: Users.models.User;
    locale: Core.types.Locales;
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

export class UserSettingsContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const { classes, user } = this.props;
        return (
            <div
                id="user-settings-container"
                className={classes.contentContainer}
            >
                <Typography variant="h5" component="h3">
                    {Core.i18n.t('settings')}
                </Typography>
                <Paper className={classes.paper}>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel htmlFor="outlined-age-native-simple">
                            {Core.i18n.t('language')}
                        </InputLabel>
                        <Select
                            native={true}
                            value={this.props.locale}
                            onChange={e => {
                                this.props.dispatch(setLocale(e.target.value));
                                this.props.dispatch(
                                    Users.actions.change_user({
                                        language: e.target.value
                                    })
                                );
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
                    <div className={classes.buttons} />
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user: state.users.ui.user,
        classes: ownProps.classes,
        locale: state.i18n.locale
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
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
    )(UserSettingsContainer)
);
