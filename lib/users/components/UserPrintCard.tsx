import * as React from 'react';
import * as debug from 'debug';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import * as Core from 'lib/core';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    username: string;
    password: string;
    wifi_name?: string;
    wifi_password?: string;
    url: string;
    classes?: any;
}

interface IComponentState {
    open: boolean;
}

const styles: StyleRulesCallback = theme => ({
    card: {
        margin: '20px',
        width: '595px',
        border: '1px solid #000000'
    }
});

export default withStyles(styles, { withTheme: true })(
    class UserPrintCardComponent extends React.Component<
        IProps,
        IComponentState
    > {
        constructor(props: IProps) {
            super(props);

            this.state = {
                open: true
            };
        }

        public render() {
            const { classes } = this.props;
            return (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography
                            className={classes.title}
                            color="textSecondary"
                            gutterBottom={true}
                        >
                            Lumi
                        </Typography>
                        {this.props.wifi_name ? (
                            <div>
                                {' '}
                                <Typography variant="h5" component="h2">
                                    {Core.i18n.t('wifi')}:{' '}
                                    {this.props.wifi_name}
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    {Core.i18n.t('password')}:{' '}
                                    {this.props.wifi_password}
                                </Typography>
                            </div>
                        ) : null}

                        <Typography variant="h5" component="h2">
                            {Core.i18n.t('username')}: {this.props.username}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {Core.i18n.t('password')}: {this.props.password}
                        </Typography>
                        <Typography component="p">
                            {Core.i18n.t('core.instruction', {
                                url: this.props.url
                            })}
                        </Typography>
                    </CardContent>
                </Card>
            );
        }
    }
);
