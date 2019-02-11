import * as React from 'react';
import * as debug from 'debug';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import * as classNames from 'classnames';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

import { Notification } from '../models';

import * as Core from 'lib/core';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    notification: Notification;
    classes?: any;
}

interface IComponentState {
    open: boolean;
}

const styles: StyleRulesCallback = theme => ({
    success: {
        backgroundColor: theme.state.success
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.state.info
    },
    warning: {
        backgroundColor: theme.state.warning
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
    margin: {
        margin: theme.spacing.unit
    }
});

export default withStyles(styles, { withTheme: true })(
    class H5PComponent extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {
                open: true
            };
        }

        public render() {
            const { notification, classes } = this.props;
            // const Icon = variantIcon[notification.variant];
            return (
                <Snackbar
                    className={classes.margin}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    open={this.state.open}
                    onClose={() => this.setState({ open: false })}
                    autoHideDuration={2500}
                >
                    <SnackbarContent
                        className={classNames(classes[notification.variant])}
                        message={
                            <span
                                id="client-snackbar"
                                className={classes.message}
                            >
                                {(() => {
                                    switch (notification.variant) {
                                        case 'info':
                                            return (
                                                <InfoIcon
                                                    className={classNames(
                                                        classes.icon,
                                                        classes.iconVariant
                                                    )}
                                                />
                                            );
                                        case 'success':
                                            return (
                                                <CheckCircleIcon
                                                    className={classNames(
                                                        classes.icon,
                                                        classes.iconVariant
                                                    )}
                                                />
                                            );
                                        case 'error':
                                            return (
                                                <ErrorIcon
                                                    className={classNames(
                                                        classes.icon,
                                                        classes.iconVariant
                                                    )}
                                                />
                                            );
                                        case 'warning':
                                            return (
                                                <WarningIcon
                                                    className={classNames(
                                                        classes.icon,
                                                        classes.iconVariant
                                                    )}
                                                />
                                            );
                                    }
                                })()}
                                {Core.i18n.t(notification.message)}
                            </span>
                        }
                    />
                </Snackbar>
            );
        }
    }
);
