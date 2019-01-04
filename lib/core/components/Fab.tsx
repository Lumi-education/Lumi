// modules
import * as React from 'react';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

interface IPassedProps {
    onClick: () => void;
    color?: 'inherit' | 'primary' | 'secondary' | 'default';
}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    }
});

export default withStyles(styles, { withTheme: true })(
    class GradientBackgroundComponent extends React.Component<
        IProps,
        IComponentState
    > {
        constructor(props: IProps) {
            super(props);

            this.state = {};
        }

        public render() {
            const { classes } = this.props;
            return (
                <Fab
                    onClick={this.props.onClick}
                    color={this.props.color}
                    className={classes.fab}
                >
                    {this.props.children}
                </Fab>
            );
        }
    }
);
