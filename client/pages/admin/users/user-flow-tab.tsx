// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { intersection } from 'lodash';
// types
import { IState } from 'client/state';

import ContentAdd from 'material-ui/svg-icons/content/add';

import { TagsChipInputContainer } from 'client/container';
import {
    Card,
    CardHeader,
    Paper,
    FloatingActionButton,
    Checkbox
} from 'material-ui';

import * as UI from 'lib/ui';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as Groups from 'lib/groups';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';

interface IPassedProps {
    user_id: string;
}
interface IStateProps extends IPassedProps {
    assignments: Flow.models.Assignment[];
    assignment: (assignment_id: string) => Flow.models.Assignment;
    card_name: (card_id: string) => string;
    user: Users.models.User;
    card: (card_id: string) => Cards.ICard;
    group: (group_id: string) => Groups.IGroup;
    selected_tags: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    show_user_dialog?: boolean;
    loading?: string;
    loading_step?: number;

    tags: string[];
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserFlowTab extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_user_dialog: false,
            loading: 'init',
            loading_step: 0,
            tags: []
        };
    }

    public render() {
        return (
            <div
                style={{
                    minHeight: '100vh'
                }}
            >
                <Paper>
                    <TagsChipInputContainer
                        tag_ids={this.state.tags}
                        onChange={tag_ids => this.setState({ tags: tag_ids })}
                    />
                </Paper>
                <Paper style={{ padding: '15px' }} />
                {this.props.user.flow.map(assignment_id => {
                    const assignment = this.props.assignment(assignment_id);

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
                                />
                            </Card>
                        </div>
                    );
                })}

                <FloatingActionButton
                    onClick={() => {
                        this.props.dispatch(
                            Users.actions.set_selected_users([
                                this.props.user_id
                            ])
                        );
                    }}
                    style={{
                        margin: '20px',
                        zIndex: 5000
                    }}
                >
                    <ContentAdd />
                </FloatingActionButton>
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
        group: (group_id: string) =>
            Groups.selectors.select_group(state, group_id),
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
