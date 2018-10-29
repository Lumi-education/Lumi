// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Tags from 'lib/tags';

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
                title="Tag erstellen"
                actions={[
                    <RaisedButton
                        label="Abbrechen"
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
                            'Erstellen',
                            'erstelle...',
                            'erstellt',
                            'Fehler'
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
