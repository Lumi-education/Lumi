// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
import { IState } from 'client/state';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// icons
import MenuIcon from '@material-ui/icons/Menu';

import * as UI from 'lib/ui';

interface IPassedProps {
    title?: string;
}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    }
});

export class AppBarComponent extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const { classes } = this.props;
        return (
            <AppBar position="fixed" className={classNames(classes.appBar)}>
                <Toolbar disableGutters={!open}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={() =>
                            this.props.dispatch(UI.actions.left_drawer_open())
                        }
                        className={classNames(classes.menuButton)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        className={classes.title}
                        variant="h6"
                        color="inherit"
                        noWrap={true}
                    >
                        {this.props.title || 'Lumi'}
                    </Typography>
                    {this.props.children}
                </Toolbar>
            </AppBar>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(AppBarComponent)
);
