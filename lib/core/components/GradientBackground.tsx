// modules
import * as React from 'react';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Particles from 'react-particles-js';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    background: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: theme.background.gradient
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
                        {this.props.children}
                    </div>
                </div>
            );
        }
    }
);
