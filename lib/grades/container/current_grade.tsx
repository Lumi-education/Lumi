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

const log = debug('lumi:lib:grades:container:grade-list');

interface IPassedProps {
    user_id: string;
}

interface IStateProps extends IPassedProps {
    grades: Grades.IGrade[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CurrentGradeContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        log('componentWillMount');

        this.props.dispatch(Grades.actions.get_user_grades(this.props.user_id));
    }

    public render() {
        const grade = parseInt(
            (
                this.props.grades.map(g => g.score).reduce((p, c) => p + c, 0) /
                this.props.grades.length *
                100
            ).toFixed(0),
            10
        );

        return (
            <Avatar backgroundColor={get_grade_color(grade)}>
                {get_grade_string(grade, false)}
            </Avatar>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        grades: Grades.selectors.grades_for_user(state, ownProps.user_id),
        user_id: ownProps.user_id
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
)(CurrentGradeContainer);
