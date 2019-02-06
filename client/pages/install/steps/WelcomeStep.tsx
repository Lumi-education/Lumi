// modules
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import * as Core from 'lib/core';
import * as Auth from 'lib/auth';

interface IPassedProps {
    enable_next: (value: boolean) => void;
}

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

        public componentWillMount() {
            this.props.enable_next(true);
        }

        public render() {
            const { classes } = this.props;
            return <div>{Core.i18n.t('install.welcome.text')}</div>;
        }
    }
);
