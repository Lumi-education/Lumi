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
            return (
                <Auth.components.RegisterForm />
                // <Grid container={true} spacing={24}>
                //     <Grid item={true} xs={12}>
                //         <TextField
                //             required={true}
                //             id="username"
                //             name="username"
                //             label={Core.i18n.t('username')}
                //             fullWidth={true}
                //             autoComplete="billing address-line1"
                //         />
                //     </Grid>
                //     <Grid item={true} xs={12} sm={6}>
                //         <TextField
                //             required={true}
                //             id="city"
                //             name="city"
                //             label={Core.i18n.t('auth.password')}
                //             fullWidth={true}
                //             autoComplete="billing address-level2"
                //         />
                //     </Grid>
                //     <Grid item={true} xs={12} sm={6}>
                //         <TextField
                //             id="state"
                //             name="state"
                //             label="State/Province/Region"
                //             fullWidth={true}
                //         />
                //     </Grid>
                // </Grid>
            );
        }
    }
);
