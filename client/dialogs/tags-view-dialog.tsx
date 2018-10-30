// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Tags from 'lib/tags';
import { CORE_ACTION_ERROR } from 'lib/core/actions';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    tag: Tags.ITag;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class TagsDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Tags.actions.reset_tag());
    }

    public render() {
        return (
            <Dialog
                title={Core.i18n.t('tag_create')}
                actions={[
                    <RaisedButton
                        label={Core.i18n.t('cancel')}
                        onClick={() =>
                            this.props.dispatch(
                                Tags.actions.toggle_tags_dialog()
                            )
                        }
                    />,
                    <UI.components.RaisedButton
                        action={Tags.actions.create_tag(
                            this.props.tag.name,
                            this.props.tag
                        )}
                        labels={[
                            Core.i18n.t('create'),
                            Core.i18n.t('creating'),
                            Core.i18n.t('created'),
                            Core.i18n.t('error')
                        ]}
                        fullWidth={false}
                        disabled={false}
                        onSuccess={() => {
                            this.props.dispatch(
                                Tags.actions.toggle_tags_dialog()
                            );
                        }}
                    />
                ]}
                open={this.props.open}
                onRequestClose={() =>
                    this.props.dispatch(Tags.actions.toggle_tags_dialog())
                }
            >
                <Tags.TagEditContainer />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.tags.ui.show_dialog,
        tag: state.tags.ui.tag
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
)(TagsDialog);
