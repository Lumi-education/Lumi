// modules
import * as React from 'react';
import * as debug from 'debug';
import * as classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';

import * as Core from 'lib/core';

import styles from './styles';

const log = debug('lumi:pages:cards:right-drawer');

interface IStateProps {
    open: boolean;
    show: () => void;
    menu_open: () => void;
    classes?: any;
    set_search_text: (text: string) => void;
}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text: string;
}

export default withStyles(styles, { withTheme: true })(
    class CardsPageRightDrawer extends React.Component<
        IProps,
        IComponentState
    > {
        private search_timeout: any;
        constructor(props: IProps) {
            super(props);

            this.state = {
                search_text: ''
            };
        }

        public render() {
            const { classes, open } = this.props;

            return (
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open
                    })}
                >
                    <Toolbar disableGutters={!open} style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.props.menu_open}
                                className={classNames(classes.menuButton)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div>
                        <div style={{ flex: 10 }}>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder={Core.i18n.t('search') + '...'}
                                    onKeyDown={e => {
                                        if (e.keyCode === 13) {
                                            this.props.set_search_text(
                                                this.state.search_text
                                            );
                                        }
                                    }}
                                    onChange={e => {
                                        clearTimeout(this.search_timeout);
                                        this.setState({
                                            search_text: e.target.value
                                        });
                                        this.search_timeout = setTimeout(() => {
                                            this.props.set_search_text(
                                                this.state.search_text
                                            );
                                        }, 300);
                                    }}
                                    value={this.state.search_text}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.props.show}
                                className={classNames(
                                    classes.menuButton,
                                    open && classes.hide
                                )}
                            >
                                <AssignmentIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            );
        }
    }
);
