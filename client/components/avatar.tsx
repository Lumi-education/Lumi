// modules
import * as React from 'react';
import * as debug from 'debug';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import styles from 'client/style/style';

// actions
import * as Core from 'lib/core';

const log_info = debug('lumi:info:components:avatar');
const log_error = debug('lumi:error:components:avatar');

interface IPassedProps {
    doc: Core.types.IDoc;
    className?: any;
}

interface IStateProps extends IPassedProps {}

interface IDispatchProps {}

interface IComponentState {
    avatar_url: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export default withStyles(styles)(
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
                        log_error(
                            'generate_avatar_url',
                            'no avatar-image found'
                        );
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
                    src={this.state.avatar_url}
                    className={this.props.className}
                >
                    {this.props.children}
                </Avatar>
            );
        }
    }
);
