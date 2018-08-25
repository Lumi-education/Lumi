// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

import { intersection } from 'lodash';
// types
import { IState } from '../../../state';

import ContentAdd from 'material-ui/svg-icons/content/add';

import {
    Card,
    CardHeader,
    Paper,
    FloatingActionButton,
    Checkbox,
    CardText
} from 'material-ui';

import AssignMaterialDialog from '../dialogs/assign_material';

import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';

import { get_grade_color } from 'lib/core/utils';
import { assign } from 'lib/flow/api';

interface IPassedProps {
    user_id: string;
    course_id: string;
}
interface IStateProps extends IPassedProps {
    assignments: Flow.models.Assignment[];
    assignment: (assignment_id: string) => Flow.models.Assignment;
    card_name: (card_id: string) => string;
    user: Users.IUser;
    card: (card_id: string) => Cards.ICard;
    group: (group_id: string) => Groups.IGroup;
    show_completed_assignments: boolean;
    selected_tags: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: string;
    loading_step?: number;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserFlowTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        // this.setState({ loading: 'Benutzer', loading_step: 1 });
        // this.props
        //     .dispatch(Users.actions.get_user(this.props.user_id))
        //     .then(user_response => {
        //         const user: Users.IUser = user_response.payload[0];
        //         this.setState({ loading: 'Aufgaben', loading_step: 2 });
        //         this.props
        //             .dispatch(
        //                 Core.actions.find(
        //                     {
        //                         _id: {
        //                             $in: user.flow
        //                         }
        //                     },
        //                     {
        //                         limit: 25
        //                     }
        //                 )
        //             )
        //             .then(assignment_response => {
        //                 this.setState({ loading: 'Karten', loading_step: 3 });
        //                 this.props
        //                     .dispatch(
        //                         Cards.actions.get_cards(
        //                             assignment_response.payload.map(
        //                                 assignment => assignment.card_id
        //                             )
        //                         )
        //                     )
        //                     .then(card_response => {
        //                         this.setState({
        //                             loading: 'finished',
        //                             loading_step: 4
        //                         });
        //                         this.props.dispatch(
        //                             Users.actions.set_selected_users([
        //                                 this.props.user_id
        //                             ])
        //                         );
        //                     });
        //             });
        //     });
    }

    public render() {
        // if (this.state.loading !== 'finished') {
        //     return (
        //         <UI.components.LoadingPage
        //             min={1}
        //             max={4}
        //             value={this.state.loading_step}
        //         >
        //             {this.state.loading}
        //         </UI.components.LoadingPage>
        //     );
        // }

        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: UI.config.gradient_bg
                }}
            >
                <Paper>
                    <Tags.TagsFilterContainer />
                </Paper>
                <Paper style={{ padding: '15px' }}>
                    <Checkbox
                        label="Zeige abgeschlossene Aufgaben"
                        checked={this.props.show_completed_assignments}
                        onCheck={() =>
                            this.props.dispatch(
                                UI.actions.toggle_show_completed_assignments()
                            )
                        }
                    />
                </Paper>
                {this.props.user.flow.map(assignment_id => {
                    const assignment = this.props.assignment(assignment_id);

                    if (
                        assignment.completed &&
                        !this.props.show_completed_assignments
                    ) {
                        return null;
                    }

                    const card = this.props.card(assignment.card_id);

                    if (
                        intersection(card.tags, this.props.selected_tags)
                            .length !== this.props.selected_tags.length
                    ) {
                        return null;
                    }

                    return (
                        <div
                            key={assignment._id}
                            onClick={() => {
                                this.props.dispatch(
                                    Flow.actions.toggle_dialog()
                                    // Flow.actions.select_assignment(
                                    //     assignment._id
                                    // )
                                );
                                this.props.dispatch(
                                    Flow.actions.change_assignment(assignment)
                                );
                            }}
                        >
                            <Card style={{ margin: '20px' }}>
                                <CardHeader
                                    title={card.name}
                                    subtitle={
                                        <Tags.TagsContainer
                                            tag_ids={card.tags}
                                        />
                                    }
                                    avatar={
                                        <Cards.components.CardScore
                                            score={assignment.get_score()}
                                        />
                                    }
                                />
                            </Card>
                        </div>
                    );
                })}

                <UI.components.ActionBar>
                    <FloatingActionButton
                        onClick={() => {
                            this.props.dispatch(
                                Users.actions.set_selected_users([
                                    this.props.user_id
                                ])
                            );
                            this.props.dispatch(
                                UI.actions.toggle_assign_material_dialog()
                            );
                        }}
                        style={{
                            margin: '20px',
                            zIndex: 5000
                        }}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </UI.components.ActionBar>
                <AssignMaterialDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        course_id: ownProps.course_id,
        user_id: ownProps.user_id,
        user: Users.selectors.user(state, ownProps.user_id),
        assignments: Flow.selectors.assignment_for_user(
            state,
            ownProps.user_id
        ),
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        card_name: (card_id: string) => Cards.selectors.name(state, card_id),
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        group: (group_id: string) =>
            Groups.selectors.select_group(state, group_id),
        show_completed_assignments: state.ui.show_completed_assignments,
        selected_tags: state.tags.ui.selected_tags
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
)(UserFlowTab);
