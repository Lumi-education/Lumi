// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton, TextField, Paper } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';
import * as Flow from 'lib/flow';
import * as Users from 'lib/users';
import * as Comments from 'lib/comments';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    card: (card_id: string) => Cards.ICard;
    assignment: Flow.IAssignment;
    comments: Comments.models.Comment[];
    user: (user_id: string) => Users.IUser;
    me: Users.IUser;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    comment?: string;
    comment_field_focused?: boolean;
}

export class AssignmentDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            comment: '',
            comment_field_focused: false
        };
    }

    public render() {
        return (
            <Dialog
                title={Core.i18n.t('assignment')}
                autoScrollBodyContent={true}
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none'
                }}
                bodyStyle={{
                    background: UI.config.default_bg
                }}
                actions={[
                    <RaisedButton
                        label={Core.i18n.t('cancel')}
                        onClick={() =>
                            this.props.dispatch(Flow.actions.toggle_dialog())
                        }
                    />,
                    <UI.components.RaisedButton
                        action={Flow.actions.archive_assignments([
                            this.props.assignment._id
                        ])}
                        labels={[
                            Core.i18n.t('archive'),
                            Core.i18n.t('archiving'),
                            Core.i18n.t('archived'),
                            Core.i18n.t('error')
                        ]}
                        fullWidth={false}
                        disabled={false}
                    />,
                    <UI.components.RaisedButton
                        action={Flow.actions.delete_assignments([
                            this.props.assignment._id
                        ])}
                        labels={[
                            Core.i18n.t('delete'),
                            Core.i18n.t('deleting'),
                            Core.i18n.t('deleted'),
                            Core.i18n.t('error')
                        ]}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={() => {
                            this.props.dispatch(Flow.actions.toggle_dialog());
                            this.props.dispatch(
                                Flow.actions.reset_assignment()
                            );
                        }}
                    />,
                    <UI.components.RaisedButton
                        action={Flow.actions.update_assignments(
                            [this.props.assignment._id],
                            this.props.assignment
                        )}
                        labels={[
                            Core.i18n.t('save'),
                            Core.i18n.t('saving'),
                            Core.i18n.t('saved'),
                            Core.i18n.t('error')
                        ]}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={() => {
                            this.props.dispatch(Flow.actions.toggle_dialog());
                            this.props.dispatch(
                                Flow.actions.reset_assignment()
                            );
                        }}
                    />
                ]}
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(Flow.actions.toggle_dialog())
                }
            >
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 2 }}>
                        <Cards.CardViewContainer
                            card_id={this.props.assignment.card_id}
                            assignment_id={this.props.assignment._id}
                        />
                        <Flow.container.AssignmentEdit />
                    </div>
                    <div
                        id="comments"
                        style={{
                            overflow: 'scroll',
                            flex: 1,
                            maxHeight: '450px',
                            background: UI.config.gradient_bg,
                            color: 'white',
                            padding: '15px 0px 15px 0px'
                        }}
                    >
                        <h1>{Core.i18n.t('comments')}</h1>

                        {this.props.comments.map(comment => {
                            return (
                                <Comments.components.Comment
                                    key={comment._id}
                                    comment={comment}
                                    ref_id={this.props.assignment._id}
                                />
                            );
                        })}
                        <Paper style={{}}>
                            {this.state.comment_field_focused ? (
                                <Core.components.Markdown
                                    markdown={this.state.comment}
                                    ref_id={this.props.assignment._id}
                                />
                            ) : null}
                            <TextField
                                fullWidth={true}
                                multiLine={true}
                                onFocus={() =>
                                    this.setState({
                                        comment_field_focused: true
                                    })
                                }
                                onBlur={() =>
                                    this.setState({
                                        comment_field_focused: false
                                    })
                                }
                                hintText={Core.i18n.t('comment')}
                                value={this.state.comment}
                                onChange={(e, v) =>
                                    this.setState({ comment: v })
                                }
                            />
                            {this.state.comment !== '' ? (
                                <RaisedButton
                                    label={Core.i18n.t('send')}
                                    onClick={() => {
                                        this.props
                                            .dispatch(
                                                Comments.actions.create_comment(
                                                    this.props.me._id,
                                                    this.props.assignment
                                                        .user_id,
                                                    this.state.comment,
                                                    this.props.assignment._id,
                                                    this.props.me.name
                                                )
                                            )
                                            .then(res => {
                                                this.setState({ comment: '' });
                                            });
                                    }}
                                    fullWidth={true}
                                    primary={true}
                                />
                            ) : null}
                        </Paper>
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.flow.ui.show_dialog,
        assignment: state.flow.ui.assignment,
        comments: Comments.selectors.ref_id(
            state,
            state.flow.ui.assignment._id
        ),
        card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        user: (user_id: string) => Users.selectors.user(state, user_id),
        me: state.users.me
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
)(AssignmentDialog);
