import * as React from 'react';
import { connect } from 'react-redux';

import * as moment from 'moment';

import {
    Avatar,
    Divider,
    Card,
    CardHeader,
    CardText,
    Paper,
    LinearProgress
} from 'material-ui';

import { IState } from 'client/state';

import * as Core from 'lib/core';
import * as Comments from 'lib/comments';
import * as Users from 'lib/users';
import * as Flow from 'lib/flow';

interface IStateProps {
    comments: Comments.models.Comment[];
    me: Users.models.User;
    assignment: (assignment_id: string) => Flow.models.Assignment;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    comment_field_focused?: boolean;
    comment?: string;
}
interface IProps extends IStateProps, IDispatchProps {}

export class UserComments extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            comment_field_focused: false,
            comment: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(Comments.actions.get_comments());
    }

    public componentWillUnmount() {
        this.props.dispatch(
            Comments.actions.comments_seen(
                this.props.comments
                    .filter(c => c.seen_by.indexOf(this.props.me._id) === -1)
                    .map(comment => comment._id),
                this.props.me._id
            )
        );
    }

    public render() {
        return (
            <div>
                {this.props.comments.length === 0 ? (
                    <Paper>
                        <h1>{Core.i18n.t('comments_no')}</h1>
                    </Paper>
                ) : null}
                {this.props.comments.map(comment => {
                    return (
                        <div
                            key={comment._id}
                            onClick={() => {
                                this.props.dispatch(
                                    Flow.actions.change_assignment(
                                        this.props.assignment(comment.ref_id)
                                    )
                                );
                            }}
                        >
                            <Card style={{ margin: '10px' }}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            backgroundColor={
                                                comment.seen_by.indexOf(
                                                    this.props.me._id
                                                ) === -1
                                                    ? '#f1c40f'
                                                    : null
                                            }
                                        >
                                            {comment.from_name.substr(0, 2)}
                                        </Avatar>
                                    }
                                    title={comment.from_name}
                                    subtitle={moment(comment.date).calendar()}
                                >
                                    <Divider />
                                </CardHeader>
                                <CardText>
                                    <Core.components.Markdown
                                        markdown={comment.text}
                                        ref_id={comment.ref_id}
                                    />
                                </CardText>
                                <div style={{ bottom: '0px' }}>
                                    {comment._id ? null : (
                                        <LinearProgress color="#9b59b6" />
                                    )}
                                </div>
                            </Card>
                        </div>
                    );
                })}
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        comments: Comments.selectors.unread(state, '*', state.users.me._id),
        me: state.users.me,
        assignment: (assignment_id: string) =>
            Flow.selectors.assignment_by_id(state, assignment_id)
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(UserComments);
