import * as React from 'react';
import { connect } from 'react-redux';

import * as moment from 'moment';

import {
    AppBar,
    Avatar,
    RaisedButton,
    Divider,
    Card,
    CardHeader,
    CardText,
    TextField,
    Paper,
    IconButton,
    LinearProgress
} from 'material-ui';

import SVGBack from 'material-ui/svg-icons/navigation/arrow-back';
import { IState } from 'client/state';

import * as Comments from 'lib/comments';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as UI from 'lib/ui';
import { push } from 'lib/ui/actions';

interface IStateProps {
    ref_id: string;
    comments: Comments.models.Comment[];
    me: Users.IUser;
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
            <div id="comments">
                <AppBar
                    style={{
                        position: 'fixed',
                        top: '0px',
                        zIndex: 9000,
                        background: 'linear-gradient(90deg, #3498db, #1abc9c)'
                    }}
                    showMenuIconButton={true}
                    title="Kommentare"
                    onLeftIconButtonTouchTap={() =>
                        this.props.dispatch(UI.actions.goBack())
                    }
                    iconElementLeft={
                        <IconButton>
                            <SVGBack />
                        </IconButton>
                    }
                />
                {this.props.comments.map(comment => {
                    // const user = this.props.user(comment.from);
                    return (
                        <div key={comment._id}>
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
                                    <Cards.components.Markdown
                                        markdown={comment.text}
                                        card_id={this.props.ref_id}
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

                <Paper
                    style={{
                        position: 'fixed',
                        bottom: '0px',
                        left: '0px',
                        right: '0px'
                    }}
                >
                    {this.state.comment !== '' ? (
                        <RaisedButton
                            label="Senden"
                            onClick={() => {
                                this.props
                                    .dispatch(
                                        Comments.actions.create_comment(
                                            this.props.me._id,
                                            'admin',
                                            this.state.comment,
                                            this.props.ref_id,
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
                    {this.state.comment_field_focused ? (
                        <Cards.components.Markdown
                            markdown={this.state.comment}
                            card_id={this.props.ref_id}
                        />
                    ) : null}
                    <Divider />
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
                        hintText="Kommentar"
                        value={this.state.comment}
                        onChange={(e, v) => this.setState({ comment: v })}
                    />
                </Paper>
            </div>
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    const ref_id = ownProps.params.ref_id;

    return {
        ref_id,
        comments: Comments.selectors.ref_id(state, ref_id),
        me: state.users.me
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
