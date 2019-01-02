// modules
import * as React from 'react';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// actions

const log_info = debug('lumi:info:components:logo');
const log_error = debug('lumi:error:components:logo');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => {
    return {
        logo: {
            color: 'white'
        }
    };
};

export default withStyles(styles, { withTheme: true })(
    class LogoComponent extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {};
        }

        public render() {
            log_info('render');

            const { classes } = this.props;
            return (
                <Typography
                    component="h1"
                    variant="h1"
                    gutterBottom={true}
                    align="center"
                    className={classes.logo}
                >
                    {this.props.children}
                </Typography>
            );
        }
    }
);
