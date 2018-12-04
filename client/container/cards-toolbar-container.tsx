// modules
import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { ToolbarSeparator } from 'material-ui';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ViewList from '@material-ui/icons/ViewList';
import ViewModule from '@material-ui/icons/ViewModule';
import SortIcon from '@material-ui/icons/Sort';

import TagsChipInputContainer from './tags-chip-input-container';
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';
import * as Cards from 'lib/cards';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    open: boolean;
    anchorEl: any;
}

export class CardsToolbarContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            open: false,
            anchorEl: null
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(Groups.actions.get_groups());
    }

    public handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    public handleClose() {
        this.setState({ anchorEl: null });
    }

    public render() {
        const { classes } = this.props;

        return (
            <Toolbar className={classes.root}>
                <div className={classes.grow}>
                    <TagsChipInputContainer
                        onChange={tag_ids => console.log(tag_ids)}
                        tag_ids={[]}
                    />
                </div>
                <ToolbarSeparator />
                <IconButton
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="Menu"
                >
                    <ViewList />
                </IconButton>
                <IconButton
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="Menu"
                >
                    <ViewModule />
                </IconButton>
                <ToolbarSeparator />
                <Button
                    aria-owns={
                        this.state.anchorEl ? 'cards_toolbar_sort' : undefined
                    }
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <SortIcon />
                    {Core.i18n.t('sort')}
                </Button>
                <Menu
                    id="cards_toolbar_sort"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose}>
                        {Core.i18n.t('newest')}
                    </MenuItem>
                    <MenuItem onClick={this.handleClose}>
                        {Core.i18n.t('best_rated')}
                    </MenuItem>
                </Menu>
            </Toolbar>
        );
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    root: {
        // width: '100%',
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(CardsToolbarContainer)
);
