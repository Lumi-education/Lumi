import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import raven from 'lib/core/raven';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { GradientBackground } from 'client/components';

// local
import * as Auth from 'lib/auth';

import Logo from '../components/logo';
import AuthSwitchContainer from './switch';

const log_info = debug('lumi:info:auth:container:auth');

interface IStateProps {
    user_id: string;
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
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

export class AuthContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        log_info('componentWillMount');
        this.props.dispatch(Auth.actions.get_session());
    }

    public render() {
        const { classes } = this.props;
        try {
            if (this.props.user_id) {
                return this.props.children;
            }
            return (
                <GradientBackground>
                    <main className={classes.main}>
                        <Logo>Lumi</Logo>
                        <AuthSwitchContainer />
                    </main>
                </GradientBackground>
            );
        } catch (err) {
            raven.captureException(err);
            raven.showReportDialog();
        }
    }
}

function mapStateToProps(state: Auth.types.IState, ownProps): IStateProps {
    return {
        user_id: state.auth.user_id,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    withRouter(
        connect<{}, {}, {}>(
            mapStateToProps,
            mapDispatchToProps
        )(AuthContainer)
    )
);
