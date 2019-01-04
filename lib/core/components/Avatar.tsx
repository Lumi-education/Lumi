// modules
import * as React from 'react';
import * as debug from 'debug';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

// actions
import * as Core from 'lib/core';

const log_info = debug('lumi:info:components:avatar');
const log_error = debug('lumi:error:components:avatar');

interface IPassedProps {
    doc: Core.types.IDoc;
    size?: number;
}

interface IStateProps extends IPassedProps {
    classes: any;
}

interface IDispatchProps {}

interface IComponentState {
    avatar_url: string;
}

interface IProps extends IStateProps, IDispatchProps {}

const styles: StyleRulesCallback = theme => {
    return {
        avatar: {
            margin: 10
        }
    };
};

export default withStyles(styles, { withTheme: true })(
    class AvatarComponent extends React.Component<IProps, IComponentState> {
        constructor(props: IProps) {
            super(props);

            this.state = {
                avatar_url: null
            };

            this.generate_avatar_url = this.generate_avatar_url.bind(this);
        }

        public generate_avatar_url() {
            log_info('generate_avatar_url');
            if (this.props.doc._attachments) {
                Core.db
                    .getAttachment(this.props.doc._id, 'avatar.jpg')
                    .then((avatar: Blob) => {
                        const avatar_url = URL.createObjectURL(avatar);
                        log_info(
                            'generate_avatar_url',
                            'avatar_url created',
                            avatar_url
                        );
                        this.setState({ avatar_url });
                    })
                    .catch(error => {
                        if (error.status === 404) {
                            log_error(
                                'generate_avatar_url',
                                'no avatar-image found'
                            );
                        } else {
                            Core.raven.captureException(error);
                        }
                    });
            }
        }

        public componentWillMount() {
            log_info('componentWillMount');
            this.generate_avatar_url();
        }

        public componentDidUpdate(prevProps: IProps) {
            log_info('componentDidUpdate', prevProps);
            if (!this.props.doc._attachments || !prevProps.doc._attachments) {
                Core.raven.captureMessage(
                    'component: avatar: _attachments is undefined',
                    { level: 'warning' }
                );
                log_error(
                    'componentDidUpdate',
                    '_attachments is undefined',
                    this.props.doc
                );
                return;
            }
            if (
                prevProps.doc._attachments['avatar.jpg'] !==
                this.props.doc._attachments['avatar.jpg']
            ) {
                this.generate_avatar_url();
            }
        }

        public render() {
            log_info('render');
            return (
                <Avatar
                    style={{ width: this.props.size, height: this.props.size }}
                    className={this.props.classes.avatar}
                    src={this.state.avatar_url}
                >
                    {this.props.children}
                </Avatar>
            );
        }
    }
);
