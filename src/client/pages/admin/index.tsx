import * as React from 'react';
import { connect } from 'react-redux';

// container
import LeftDrawer from './left-drawer';
import RightDrawer from './right-drawer';
import AppBar from './app-bar';

// state
import { IState } from 'client/state';

// modules
import { ui_actions } from 'lib/ui';
import { random_bg } from 'lib/ui/utils';
import * as Grades from 'lib/grades';

interface IStateProps {
    location;
    userlevel: number;
    right_appbar_icon: JSX.Element;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AdminRoot extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (this.props.userlevel < 2) {
            this.props.dispatch(ui_actions.push('/user'));
        }
    }

    public render() {
        return (
            <div id="AdminRoot">
                <AppBar />
                <LeftDrawer />
                <RightDrawer />
                <div style={{ paddingTop: '120px', paddingBottom: '40px' }}>
                    {this.props.children}
                </div>

                <Grades.CreateGradeDialogContainer />
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        location: ownProps.location,
        userlevel: state.auth.userlevel,
        right_appbar_icon: state.ui.right_appbar_icon
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminRoot
);
