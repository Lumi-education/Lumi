import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// types
import { IState } from '../types';

// components

import { Dialog, List, ListItem, IconButton } from 'material-ui';
import SVGView from 'material-ui/svg-icons/image/remove-red-eye';

// modules
import * as Core from 'lib/core';

const log = debug('lumi:lib:grades:container:grade-list');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    _attachments;
    doc_id: string;
    open: boolean;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class AttachmentListContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        log('componentWillMount');
    }

    public render() {
        return (
            <Dialog
                title="Attachments"
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(Core.actions.hide_attachment_dialog())
                }
            >
                <List>
                    {(() => {
                        return Object.keys(this.props._attachments || {}).map(
                            key => (
                                <a
                                    href={
                                        '/api/v0/cards/' +
                                        this.props.doc_id +
                                        '/attachment/' +
                                        key
                                    }
                                    target="_blank"
                                >
                                    <ListItem
                                        key={key}
                                        primaryText={key}
                                        rightIconButton={
                                            <IconButton>
                                                <SVGView />
                                            </IconButton>
                                        }
                                    />
                                </a>
                            )
                        );
                    })()}
                </List>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        doc_id: state.core.attachments.doc_id,
        _attachments: state.core.attachments._attachments,
        open: state.core.attachments.dialog_open
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
)(AttachmentListContainer);
