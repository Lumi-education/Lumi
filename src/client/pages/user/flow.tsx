import * as React from 'react';
import {connect} from 'react-redux';

// material-ui
import {Avatar, List, ListItem, Subheader, Divider, Paper} from 'material-ui';

// material-ui -> icons
import * as moment from 'moment-timezone';
// actions
import {push} from 'lib/ui/actions';

// types
import {IState} from 'client/state';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as Core from 'lib/core';

interface IPassedProps {
    course_id: string;
}
interface IStateProps extends IPassedProps {
    assignment: (assignment_id: string) => Flow.IAssignment;
    flow: string[];
    card: (card_id: string) => Cards.ICard;
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserFlow extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props
            .dispatch(
                Core.actions.find(
                    {type: 'assignment', _id: {$in: this.props.flow}},
                    {limit: 100}
                )
            )
            .then(assignment_response => {
                const assignments = assignment_response.payload;

                this.props.dispatch(
                    Cards.actions.get_cards(
                        assignments.map(assignment => assignment.card_id)
                    )
                );
            });
    }

    public render() {
        return (
            <Paper>
                <List>
                    <Subheader>Aufgaben</Subheader>
                    {this.props.flow.map((assignment_id: string) => {
                        const assignment = this.props.assignment(assignment_id);
                        const card = this.props.card(assignment.card_id);

                        return (
                            <ListItem
                                leftAvatar={
                                    <Avatar>
                                        <Cards.components.CardType
                                            card_type={card.card_type}
                                        />
                                    </Avatar>
                                }
                                key={assignment._id}
                                primaryText={card.name}
                                secondaryText={card.description}
                                onClick={() =>
                                    this.props.dispatch(
                                        push(
                                            '/user/course/' +
                                                this.props.course_id +
                                                '/flow/' +
                                                assignment_id
                                        )
                                    )
                                }
                            />
                        );
                    })}
                </List>
            </Paper>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const course_id = ownProps.location.query.course_id || [];
    return {
        course_id,
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        flow: state.users.me.flow[course_id] || [],
        card: (card_id: string) => Cards.selectors.select_card(state, card_id)
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
)(UserFlow);
