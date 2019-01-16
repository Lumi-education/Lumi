// modules
import * as React from 'react';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// icons
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import RemoveCircleOutlinedIcon from '@material-ui/icons/RemoveCircleOutlined';

import * as Core from 'lib/core';

interface IPassedProps {
    title: string;

    on_add_click: () => void;
    on_remove_click: () => void;
}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    grow: {
        flexGrow: 1
    },
    toolbar: {
        background: theme.background.gradient
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        },
        color: 'white'
    },

    sectionDesktop: {
        display: 'flex',
        color: 'white'
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
                <Toolbar className={classes.toolbar}>
                    <Typography
                        className={classes.title}
                        variant="h6"
                        color="inherit"
                        noWrap={true}
                    >
                        {this.props.title}
                    </Typography>
                    <Core.components.SearchField />
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            onClick={this.props.on_remove_click}
                            color="inherit"
                        >
                            <RemoveCircleOutlinedIcon />
                        </IconButton>
                        <IconButton
                            onClick={this.props.on_add_click}
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <AddCircleOutlinedIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            );
        }
    }
);
