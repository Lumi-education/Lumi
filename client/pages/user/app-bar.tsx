// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { AppBar } from 'material-ui';

// local
import { IState } from 'client/state';

// actions
import { right_drawer_open, left_drawer_open } from 'lib/ui/actions';

interface IStateProps {}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserAppBar extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <AppBar
                onLeftIconButtonClick={() =>
                    this.props.dispatch(left_drawer_open())
                }
                onRightIconButtonClick={() =>
                    this.props.dispatch(right_drawer_open())
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(UserAppBar);
