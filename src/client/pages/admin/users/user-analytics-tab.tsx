// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';

// types
import { IState } from 'client/state';

import { LineChart, ColumnChart } from 'react-chartkick';

import {
    Badge,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    SelectField,
    MenuItem,
    Paper,
    FloatingActionButton
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
import { assign } from 'lib/flow/actions';

interface IPassedProps {
    user_id: string;
}
interface IStateProps extends IPassedProps {
    assignments: Flow.models.Assignment[];
    assignment: (assignment_id: string) => Flow.models.Assignment;
    assignments_for_cards: (card_id: string[]) => Flow.models.Assignment[];
    card_name: (card_id: string) => string;
    user: Users.IUser;
    card: (card_id: string) => Cards.ICard;
    selected_tags: string[];
    tag: (tag_id: string) => Tags.ITag;
    cards_with_tag: (tag_id: string) => Cards.ICard[];
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

export class UserAnalyticsTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'init',
            loading_step: 0
        };
    }

    public componentWillMount() {
        this.setState({ loading: 'Benutzer', loading_step: 1 });

        this.props
            .dispatch(Users.actions.get_user(this.props.user_id))
            .then(user_response => {
                const user: Users.IUser = user_response.payload[0];

                this.setState({ loading: 'Aufgaben', loading_step: 2 });
                this.props
                    .dispatch(
                        Core.actions.find(
                            {
                                _id: {
                                    $in: user.flow
                                }
                            },
                            {
                                limit: 25
                            }
                        )
                    )
                    .then(assignment_response => {
                        this.setState({ loading: 'Karten', loading_step: 3 });
                        this.props
                            .dispatch(
                                Cards.actions.get_cards(
                                    assignment_response.payload.map(
                                        assignment => assignment.card_id
                                    )
                                )
                            )
                            .then(card_response => {
                                this.setState({
                                    loading: 'finished',
                                    loading_step: 4
                                });
                                this.props.dispatch(
                                    Users.actions.set_selected_users([
                                        this.props.user_id
                                    ])
                                );
                            });
                    });
            });
    }

    public render() {
        if (this.state.loading !== 'finished') {
            return (
                <UI.components.LoadingPage
                    min={1}
                    max={4}
                    value={this.state.loading_step}
                >
                    {this.state.loading}
                </UI.components.LoadingPage>
            );
        }

        const line_data = this.props.selected_tags.map(tag_id => {
            const tag = this.props.tag(tag_id);
            const cards = this.props.cards_with_tag(tag_id);
            const assignments = this.props
                .assignments_for_cards(cards.map(card => card._id))
                .filter(assignment => assignment.get_finished() !== null)
                .filter(assignment => assignment.user_id === this.props.user_id)
                .map((assignment, index) => [
                    assignment.get_finished(),
                    assignment.get_score()
                ]);

            return { name: tag.name, color: tag.color, data: assignments };
        });

        const column_data = this.props.selected_tags.map(tag_id => {
            const tag = this.props.tag(tag_id);
            const cards = this.props.cards_with_tag(tag_id);
            const assignments = this.props
                .assignments_for_cards(cards.map(card => card._id))
                .filter(assignment => assignment.get_finished() !== null)
                .filter(
                    assignment => assignment.user_id === this.props.user_id
                );
            const data = assignments
                .map((assignment, index) => assignment.get_score())
                .reduce(Core.utils.avg, 0);

            const o = {};
            o[tag.name] = data;
            return { name: tag.name, color: tag.color, data: o };
        });

        return (
            <div id="user-analytics-tab">
                <Paper>
                    <Tags.TagsFilterContainer />
                </Paper>

                <Paper>
                    <h1>Entwicklung vom ... bis ...</h1>
                    <LineChart min={0} max={100} data={line_data} />
                </Paper>
                <Paper style={{ marginTop: '20px' }}>
                    <h1>Durchschnitt vom ... bis ...</h1>
                    <ColumnChart min={0} max={100} data={column_data} />
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
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
        cards_with_tag: tag_id => Cards.selectors.with_tags(state, [tag_id]),
        assignments_for_cards: (card_ids: string[]) =>
            Flow.selectors.assignments_for_cards(state, card_ids),
        tag: (tag_id: string) => Tags.selectors.tag(state, tag_id),
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
)(UserAnalyticsTab);
