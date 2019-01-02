import * as React from 'react';

// material-ui
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// modules
import Raven from 'lib/core/raven';
import * as Core from 'lib/core';

interface IPassedProps {
    classes: any;
}

interface IDispatchProps {}

interface IProps extends IPassedProps, IDispatchProps {}

interface IComponentState {
    error: any;
    errorInfo: any;
}

const styles: StyleRulesCallback = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(
    class ErrorBoundary extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);
            this.state = { error: null, errorInfo: null };
        }

        public componentDidCatch(error, errorInfo) {
            this.setState({ error, errorInfo });
            Raven.captureException(error, { extra: errorInfo });
        }

        public render() {
            const { classes } = this.props;

            if (this.state.error) {
                return (
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="h5" component="h3">
                            {Core.i18n.t('error_msg')}
                        </Typography>
                        <Typography component="p">
                            {Core.i18n.t('error')}:{' '}
                            {this.state.error.toString()}
                        </Typography>
                    </Paper>
                );
            }
            return this.props.children;
        }
    }
);
