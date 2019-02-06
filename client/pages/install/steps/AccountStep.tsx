// modules
import * as React from 'react';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import * as Auth from 'lib/auth';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles, { withTheme: true })(
    class InstallAccountComponent extends React.Component<
        IProps,
        IComponentState
    > {
        constructor(props: IProps) {
            super(props);

            this.state = {};
        }

        public render() {
            const { classes } = this.props;
            return <Auth.components.RegisterForm />;
        }
    }
);
