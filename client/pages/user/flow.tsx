import * as React from 'react';
import { connect } from 'react-redux';

// material-ui
import {
    Avatar,
    List,
    ListItem,
    Paper,
    IconMenu,
    IconButton,
    MenuItem
} from 'material-ui';

// svg
import SVGCheckbox from 'material-ui/svg-icons/navigation/check';
import SVGCheckboxIndeterminate from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import SVGComment from 'material-ui/svg-icons/communication/comment';

// types
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as Cards from 'lib/cards';
import * as UI from 'lib/ui';
import * as Comments from 'lib/comments';

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    assignment: (assignment_id: string) => Flow.models.Assignment;
    flow: string[];
    card: (card_id: string) => Cards.ICard;
    ui: UI.IUI;
    unread_comments: (assignment_id: string) => Comments.models.Comment[];
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

    public render() {
        return (
            <Paper>
                {this.props.flow.length === 0
                    ? Core.i18n.t('list_empty')
                    : null}
                <List>
                    {this.props.flow.map((assignment_id: string) => {
                        const assignment = this.props.assignment(assignment_id);
                        if (assignment.completed) {
                            return null;
                        }
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
                                rightIconButton={(() => {
                                    if (
                                        this.props.unread_comments(
                                            assignment._id
                                        ).length !== 0
                                    ) {
                                        return (
                                            <IconButton
                                                onClick={e => {
                                                    this.props.dispatch(
                                                        UI.actions.push(
                                                            '/user/assignment/' +
                                                                assignment._id +
                                                                '/comments'
                                                        )
                                                    );
                                                    e.preventDefault();
                                                }}
                                            >
                                                <SVGComment color="#f1c40f" />
                                            </IconButton>
                                        );
                                    }
                                    if (
                                        assignment.state !== null &&
                                        assignment.get_score() !== null
                                    ) {
                                        return (
                                            <IconMenu
                                                iconButtonElement={
                                                    <IconButton>
                                                        <SVGCheckbox />
                                                    </IconButton>
                                                }
                                                anchorOrigin={{
                                                    horizontal: 'right',
                                                    vertical: 'bottom'
                                                }}
                                                targetOrigin={{
                                                    horizontal: 'right',
                                                    vertical: 'bottom'
                                                }}
                                            >
                                                <MenuItem
                                                    primaryText={Core.i18n.t(
                                                        'archive'
                                                    )}
                                                    onClick={() =>
                                                        this.props.dispatch(
                                                            Flow.actions.archive_assignments(
                                                                [assignment._id]
                                                            )
                                                        )
                                                    }
                                                />
                                            </IconMenu>
                                        );
                                    }

                                    if (
                                        assignment.state !== null &&
                                        assignment.get_score() === null
                                    ) {
                                        return (
                                            <IconButton>
                                                <SVGCheckboxIndeterminate />
                                            </IconButton>
                                        );
                                    }
                                })()}
                                primaryText={card.name}
                                secondaryText={card.description}
                                onClick={() =>
                                    this.props.dispatch(
                                        UI.actions.push(
                                            '/user/assignment/' + assignment_id
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
    return {
        assignment: assignment_id =>
            Flow.selectors.assignment_by_id(state, assignment_id),
        flow: state.users.me.flow || [],
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        ui: state.ui,
        unread_comments: (assignment_id: string) =>
            Comments.selectors.unread(state, assignment_id, state.users.me._id)
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
