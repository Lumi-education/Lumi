// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// material-ui
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

// material-ui -> icons
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGFilter from 'material-ui/svg-icons/content/filter-list';

import TagFilterContainer from 'lib/tags/container/tag-filter';

// types
import { IState } from 'client/state';
declare var process;
// actions
import {
    right_drawer_close,
    right_drawer_open,
    push,
    set_right_appbar_icon,
    toggle_tag_id_filter
} from 'lib/ui/actions';
import { logout } from 'lib/auth/actions';

const log = debug('lumi:pages:cards:right-drawer');

interface IStateProps {
    show: boolean;
    tags_filter: string[];
}

interface IDispatchProps {
    open: () => void;
    close: () => void;
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardsRightDrawer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.handleClose = this.handleClose.bind(this);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(
            set_right_appbar_icon(
                <IconButton>
                    <SVGFilter />
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
                        style={{ backgroundColor: '#3498db' }}
                        showMenuIconButton={true}
                        iconElementLeft={
                            <IconButton>
                                <SVGClose />
                            </IconButton>
                        }
                        onLeftIconButtonTouchTap={() => this.props.close()}
                    />
                    <TagFilterContainer
                        tag_ids={this.props.tags_filter}
                        add={tag =>
                            this.props.dispatch(toggle_tag_id_filter(tag._id))
                        }
                        delete={tag_id =>
                            this.props.dispatch(toggle_tag_id_filter(tag_id))
                        }
                    />
                </Drawer>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IStateProps {
    return {
        show: state.ui.right_drawer_show,
        tags_filter: state.ui.tags_filter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        open: () => dispatch(right_drawer_open()),
        close: () => dispatch(right_drawer_close()),
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    CardsRightDrawer
);
