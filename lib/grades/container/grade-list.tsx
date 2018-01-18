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

export class GradeListContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        log('componentWillMount');

        this.props.dispatch(Grades.actions.get_user_grades(this.props.user_id));
    }

    public render() {
        return (
            <List>
                {this.props.grades.length === 0 ? (
                    <ListItem key="nogrades" primaryText="No Grades" />
                ) : null}
                {this.props.grades.map(grade => (
                    <div key={grade._id}>
                        <ListItem
                            leftAvatar={
                                <Avatar
                                    backgroundColor={get_grade_color(
                                        grade.score * 100
                                    )}
                                    size={50}
                                >
                                    {get_grade_string(grade.score * 100, false)}
                                </Avatar>
                            }
                            primaryText={grade.grade_type}
                            secondaryText={
                                <span>
                                    <span>
                                        {moment(grade.created_at).calendar()}
                                    </span>
                                    <br />
                                    {grade.note}
                                </span>
                            }
                            secondaryTextLines={2}
                        />
                        <Divider inset={true} />
                    </div>
                ))}
            </List>
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
)(GradeListContainer);
