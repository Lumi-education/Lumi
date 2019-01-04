// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
import { IState } from 'client/state';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import InputBase from '@material-ui/core/InputBase';

// icons
import SearchIcon from '@material-ui/icons/Search';

import * as Core from 'lib/core';
import * as UI from 'lib/ui';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    classes: any;
    search_text: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => ({
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    search: {
        color: 'white',
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto'
        }
    },
    inputRoot: {
        color: 'inherit',
        width: '100%'
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200
        }
    }
});

export class AppBarSearchFieldComponent extends React.Component<
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
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder={Core.i18n.t('search') + '...'}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput
                    }}
                    onChange={e =>
                        this.props.dispatch(
                            UI.actions.set_search_filter(e.target.value)
                        )
                    }
                    value={this.props.search_text}
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        classes: ownProps.classes,
        search_text: state.ui.search_filter_text
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
    )(AppBarSearchFieldComponent)
);
