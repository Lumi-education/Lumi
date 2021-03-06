import * as React from 'react';
import { connect } from 'react-redux';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { IState } from 'client/state';

import * as Core from 'lib/core';
import * as UI from 'lib/ui';

interface IStateProps {
    system: Core.types.ISystemSettings;

    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {}
interface IProps extends IStateProps, IDispatchProps {}

export class AdminDashboardPage extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Core.actions.get_settings());
    }

    public render() {
        const { system, classes } = this.props;
        return (
            <div id="admin_dashboard">
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent>
                            <Typography
                                gutterBottom={true}
                                variant="h5"
                                component="h2"
                            >
                                http://{system.ip || window.location.host}
                                {system.port
                                    ? parseInt(system.port, 10) === 80
                                        ? null
                                        : ':' + system.port
                                    : null}
                            </Typography>
                            <Typography component="p">
                                {Core.i18n.t('ip_description')}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        system: state.core.system,
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    card: {
        maxWidth: 345,
        margin: '10px'
    }
});

export default withStyles(styles)(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(AdminDashboardPage)
);
