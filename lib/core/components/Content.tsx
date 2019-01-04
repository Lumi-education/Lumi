// modules
import * as React from 'react';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    paper: {
        maxWidth: '680px',
        margin: 'auto',
        marginTop: '40px'
    }
});

export default withStyles(styles, { withTheme: true })(
    class ContentComponent extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {};
        }

        public render() {
            const { classes } = this.props;
            return (
                <Paper className={classes.paper}>{this.props.children}</Paper>
            );
        }
    }
);
