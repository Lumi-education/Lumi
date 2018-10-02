// modules
import * as React from 'react';
import * as debug from 'debug';

import * as moment from 'moment';

import {
    Avatar,
    Card,
    CardHeader,
    CardText,
    Divider,
    LinearProgress
} from 'material-ui';
// types

import * as Comments from '../';
import * as Core from 'lib/core';

interface IPassedProps {
    comment: Comments.types.IComment;
    ref_id: string;
}

interface IDispatchProps {}

interface IProps extends IPassedProps, IDispatchProps {}

export default class CommentComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const comment = this.props.comment;

        return (
            <Card style={{ margin: '5px' }}>
                <CardHeader
                    avatar={<Avatar>{comment.from_name.substr(0, 2)}</Avatar>}
                    title={comment.from_name}
                    subtitle={moment(comment.date).calendar()}
                >
                    <Divider />
                </CardHeader>
                <CardText>
                    <Core.components.Markdown
                        markdown={comment.text}
                        ref_id={this.props.ref_id}
                    />
                </CardText>
                <div style={{ bottom: '0px' }}>
                    {comment._id ? null : <LinearProgress color="#9b59b6" />}
                </div>
            </Card>
        );
    }
}
