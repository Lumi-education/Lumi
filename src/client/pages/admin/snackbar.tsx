import * as React from 'react';
import { connect } from 'react-redux';

import { Snackbar } from 'material-ui';

// state
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';

interface IStateProps {
    text: string;
    open: boolean;
}

interface IDispatchProps {
    left_drawer_open: () => void;
    left_drawer_close: () => void;
    dispatch: (action) => void;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminSnackbar extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (!this.props.open && nextProps.open) {
            setTimeout(() => {
                this.props.dispatch(UI.actions.snackbar_close());
            }, 4000);
        }
    }

    public render() {
        return (
            <Snackbar
                open={this.props.open}
                message={this.props.text}
                autoHideDuration={4000}
            />
        );
    }
}

function mapStateToProps(state: IState): IStateProps {
    return {
        text: state.ui.snackbar_text,
        open: state.ui.snackbar_open
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AdminSnackbar);
