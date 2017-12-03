import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from 'client/state';

// components
import LeftDrawer from './left-drawer';

// actions

interface IStateProps {
    location;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class Root extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div id="root">
                <LeftDrawer />
                <div style={{ paddingBottom: '40px' }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        location: ownProps.location
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(Root);
