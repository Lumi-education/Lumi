import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import * as moment from 'moment-timezone';

// components
import {
    Avatar,
    Divider,
    List,
    ListItem,
    IconMenu,
    IconButton
} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// modules
import * as Grades from '../';
import { get_grade_color, get_grade_string } from 'lib/ui/utils';

const log = debug('lumi:lib:grades:container:grade-list');

type IMenuItem = (grade: Grades.IGrade) => JSX.Element;

interface IPassedProps {
    user_id: string;
    menuItems?: IMenuItem[];
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
                {this.props.grades
                    .sort(
                        (a, b) =>
                            new Date(b.created_at as any).getTime() -
                            new Date(a.created_at as any).getTime()
                    )
                    .map(grade => (
                        <div key={grade._id}>
                            <ListItem
                                leftAvatar={
                                    <Avatar
                                        backgroundColor={get_grade_color(
                                            grade.score * 100
                                        )}
                                        size={50}
                                    >
                                        {get_grade_string(
                                            grade.score * 100,
                                            false
                                        )}
                                    </Avatar>
                                }
                                primaryText={grade.grade_type}
                                secondaryText={
                                    <span>
                                        <span>
                                            {moment(grade.created_at)
                                                .tz('Europe/Berlin')
                                                .calendar()}
                                        </span>
                                        <br />
                                        {grade.note}
                                    </span>
                                }
                                secondaryTextLines={2}
                                rightIconButton={
                                    this.props.menuItems ? (
                                        <IconMenu
                                            iconButtonElement={
                                                iconButtonElement
                                            }
                                        >
                                            {this.props.menuItems.map(f =>
                                                f(grade)
                                            )}
                                        </IconMenu>
                                    ) : null
                                }
                            />
                            <Divider inset={true} />
                        </div>
                    ))}
            </List>
        );
    }
}

function mapStateToProps(state: Grades.IState, ownProps): IStateProps {
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

const iconButtonElement = (
    <IconButton touch={true}>
        <MoreVertIcon />
    </IconButton>
);
