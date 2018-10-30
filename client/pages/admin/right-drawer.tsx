// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import {
    AppBar,
    Drawer,
    List,
    Subheader,
    IconButton,
    ListItem,
    Toggle
} from 'material-ui';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';

// types
import { IState } from 'client/state';

// actions
import {
    right_drawer_close,
    right_drawer_open,
    set_right_appbar_icon
} from 'lib/ui/actions';

import * as UI from 'lib/ui';
import * as Core from 'lib/core';

const log = debug('lumi:pages:cards:right-drawer');

interface IStateProps {
    show: boolean;
    system: Core.types.ISystemSettings;
}

interface IDispatchProps {
    open: () => void;
    close: () => void;
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class RightDrawer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.handleClose = this.handleClose.bind(this);

        this.state = {};
    }

    public componentWillUnmount() {
        this.props.dispatch(set_right_appbar_icon(null));
    }

    public handleClose() {
        this.props.close();
    }

    public render() {
        return (
            <div>
                <Drawer
                    docked={true}
                    open={this.props.show}
                    openSecondary={true}
                    onRequestChange={() => {
                        this.props.show
                            ? this.props.close()
                            : this.props.open();
                    }}
                >
                    <AppBar
                        style={{ backgroundColor: UI.config.secondary_color }}
                        showMenuIconButton={true}
                        iconElementLeft={
                            <IconButton>
                                <SVGClose />
                            </IconButton>
                        }
                        onLeftIconButtonClick={() => this.props.close()}
                    />
                    <List>
                        <Subheader>{Core.i18n.t('settings')}</Subheader>
                        <ListItem
                            rightToggle={
                                <Toggle
                                    toggled={
                                        this.props.system.mode === 'controlled'
                                    }
                                    onToggle={() => {
                                        this.props.dispatch(
                                            Core.actions.update('system', {
                                                mode:
                                                    this.props.system.mode ===
                                                    'free'
                                                        ? 'controlled'
                                                        : 'free'
                                            })
                                        );
                                    }}
                                />
                            }
                            primaryText={Core.i18n.t('controlled_mode')}
                            secondaryText={
                                this.props.system.controlled_location
                            }
                        />
                    </List>
                </Drawer>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IStateProps {
    return {
        show: state.ui.right_drawer_show,
        system: state.core.system
    };
}

function mapDispatchToProps(dispatch) {
    return {
        open: () => dispatch(right_drawer_open()),
        close: () => dispatch(right_drawer_close()),
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(RightDrawer);
