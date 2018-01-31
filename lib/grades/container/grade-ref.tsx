import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import * as moment from 'moment';

// types
import { IState } from '../types';

// components

import { Avatar, Divider, List, ListItem } from 'material-ui';

// modules
import * as Grades from '../';
import { get_grade_color, get_grade_string } from 'lib/ui/utils';

const log = debug('lumi:lib:grades:container:grade-ref');

interface IPassedProps {
    ref_id: string;
    user_id: string;
}

interface IStateProps extends IPassedProps {
    grade: Grades.IGrade;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GradeRefContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        log('componentWillMount');

        // this.props.dispatch(Grades.actions.get_user_grades(this.props.user_id));
    }

    public render() {
        if (!this.props.grade._id) {
            return <Avatar>0</Avatar>;
        }
        return (
            <Avatar
                backgroundColor={get_grade_color(this.props.grade.score * 100)}
            >
                {get_grade_string(this.props.grade.score * 100, false)}
            </Avatar>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        user_id: ownProps.user_id,
        grade: Grades.selectors.by_ref(
            state,
            ownProps.user_id,
            ownProps.ref_id
        ),
        ref_id: ownProps.ref_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(GradeRefContainer);
