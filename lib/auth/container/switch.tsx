import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import raven from 'lib/core/raven';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// components
import Button from '@material-ui/core/Button';

// modules
import * as Core from 'lib/core';
import * as Auth from '../';

import Login from './login';
import Register from './register';

const log_info = debug('lumi:auth:container:login');

interface IComponentState {}

interface IStateProps {
    allow_user_registration: boolean;

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    component: 'switch' | 'login' | 'register';
}

const styles: StyleRulesCallback = theme => ({
    button: {
        margin: '5px'
    }
});

export class AuthSwitchContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            component: 'switch'
        };
    }

    public render() {
        const { classes } = this.props;

        try {
            switch (this.state.component) {
                case 'switch':
                default:
                    return (
                        <div>
                            {/* {this.props.allow_user_registration ? (
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    fullWidth={true}
                                    onClick={() =>
                                        this.setState({ component: 'register' })
                                    }
                                >
                                    {Core.i18n.t('auth.register')}
                                </Button>
                            ) : null} */}
                            <Button
                                className={classes.button}
                                variant="outlined"
                                fullWidth={true}
                                onClick={() =>
                                    this.setState({ component: 'login' })
                                }
                            >
                                {Core.i18n.t('auth.login')}
                            </Button>
                        </div>
                    );
                case 'login':
                    return <Login />;
                case 'register':
                    return <Register />;
            }
        } catch (err) {
            raven.captureException(err);
        }
    }
}

function mapStateToProps(state: Auth.types.IState, ownProps): IStateProps {
    return {
        allow_user_registration: true,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(AuthSwitchContainer)
);
