// modules
import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import MUISnackbar from 'material-ui/Snackbar';

// actions

import {
    left_drawer_open,
    left_drawer_close,
    push
} from 'client/packages/ui/actions';

// local
import { IState } from 'client/state';

interface IProps {
    open: boolean;
    message: string;
}

export class Snackbar extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <MUISnackbar
                open={this.props.open}
                message={this.props.message}
                action="ok"
            />
        );
    }
}

function mapStateToProps(state: IState): IProps {
    return {
        open: state.ui.snackbar_open,
        message: state.ui.snackbar_text
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    Snackbar
);
