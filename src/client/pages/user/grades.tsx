import * as React from 'react';
import {connect} from 'react-redux';

import {IState} from 'client/state';

import {MenuItem} from 'material-ui';
import SVGView from 'material-ui/svg-icons/image/remove-red-eye';

import * as Grades from 'lib/grades';
import * as Core from 'lib/core';

interface IStateProps {
    user_id: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserDashboard extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div id="user-grades">
                <Grades.CurrentGradeListContainer
                    user_id={this.props.user_id}
                />
                <Grades.GradeListContainer user_id={this.props.user_id} />
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user_id: state.auth.user_id
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(UserDashboard);
