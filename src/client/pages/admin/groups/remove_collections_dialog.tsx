import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove-circle';
import * as shortid from 'shortid';

import { IState } from 'client/state';

import { ICollection } from 'lib/collections/types';
import * as Groups from 'lib/groups';

// selectors
import { select_group } from 'lib/groups/selectors';

// actions

import * as Collections from 'lib/collections';

interface IPassedProps {
    group_id: string;
}

interface IStateProps extends IPassedProps {
    collections: ICollection[];
    group: Groups.IGroup;
    selected_collections: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    name?: string;

    open?: boolean;
}

export class AdminRemoveCollectionDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: '',
            open: false
        };

        this.remove_collections = this.remove_collections.bind(this);
        this.close = this.close.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(Collections.actions.get_collections());
    }

    public remove_collections() {
        this.props
            .dispatch(
                Groups.actions.rem_collection_from_group(
                    this.props.group_id,
                    this.props.selected_collections
                )
            )
            .then(res => {
                this.close();
                this.props.dispatch(
                    Collections.actions.reset_collection_selection()
                );
            });
    }

    public close() {
        this.setState({ open: false });
    }

    public render() {
        const actions = [
            <FlatButton label="Cancel" primary={true} onClick={this.close} />,
            <FlatButton
                label="Remove"
                primary={true}
                onClick={() => this.remove_collections()}
            />
        ];

        return (
            <div>
                <FloatingActionButton
                    onClick={() =>
                        this.setState({
                            open: true
                        })
                    }
                    style={{ margin: '20px' }}
                    secondary={true}
                >
                    <ContentRemove />
                </FloatingActionButton>
                <Dialog
                    title="Remove Collections"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    onRequestClose={() => this.setState({ open: false })}
                >
                    Remove collections{' '}
                    {this.props.collections.map(c => <span> {c.name} </span>)}{' '}
                    from this group?
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collections: Collections.selectors.select_collections_by_ids(
            state,
            state.collections.ui.selected_collections
        ),
        selected_collections: state.collections.ui.selected_collections,
        group: select_group(state, ownProps.group_id),
        group_id: ownProps.group_id
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
)(AdminRemoveCollectionDialog);
