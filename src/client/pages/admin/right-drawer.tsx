// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import { AppBar, Drawer, List, Subheader, IconButton } from 'material-ui';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGGroup from 'material-ui/svg-icons/social/group';

// types
import { IState } from 'client/state';

// actions
import {
    right_drawer_close,
    right_drawer_open,
    set_right_appbar_icon
} from 'lib/ui/actions';

import * as UI from 'lib/ui';

const log = debug('lumi:pages:cards:right-drawer');

interface IStateProps {
    show: boolean;
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

    public componentWillMount() {
        this.props.dispatch(
            set_right_appbar_icon(
                <IconButton>
                    <SVGGroup />
                </IconButton>
            )
        );
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
                        onLeftIconButtonTouchTap={() => this.props.close()}
                    />
                    <List>
                        <Subheader>-</Subheader>
                    </List>
                </Drawer>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IStateProps {
    return {
        show: state.ui.right_drawer_show
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
