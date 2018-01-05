import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import * as shortid from 'shortid';

import { IState } from 'client/state';

import { ICollection } from 'client/packages/collections/types';
import { IGroup } from 'client/packages/groups';

// selectors
import { select_group } from 'client/packages/groups/selectors';

// actions
import { get_collections } from 'client/packages/collections/actions';

import { add_collection_to_group } from 'client/packages/groups/actions';

interface IPassedProps {
    group_id: string;
}

interface IStateProps extends IPassedProps {
    collections: ICollection[];
    group: IGroup;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    name?: string;

    open?: boolean;
}

export class AdminAddCollectionDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: '',
            open: false
        };

        this.add_collection = this.add_collection.bind(this);
        this.close = this.close.bind(this);
    }

    public componentWillMount() {
        this.props.dispatch(get_collections());
    }

    public add_collection(collection) {
        if (collection._id) {
            this.props
                .dispatch(
                    add_collection_to_group(this.props.group_id, collection._id)
                )
                .then(res => {
                    this.close();
                });
        } else {
            // this.props.dispatch( create_user(collection, { groups: [ this.props.group_id ]}) );
        }
    }

    public close() {
        this.setState({ open: false });
    }

    public render() {
        const actions = [
            <FlatButton label="Cancel" primary={true} onClick={this.close} />,
            <FlatButton
                label="Add"
                primary={true}
                onClick={() => this.add_collection(this.state.name)}
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
                >
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    title="Add Collection"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    onRequestClose={() => this.setState({ open: false })}
                >
                    <AutoComplete
                        floatingLabelText="Search collections"
                        filter={AutoComplete.fuzzyFilter}
                        dataSource={this.props.collections.filter(
                            collection =>
                                this.props.group.assigned_collections.indexOf(
                                    collection._id
                                ) === -1
                        )}
                        dataSourceConfig={{ text: 'name', value: '_id' }}
                        maxSearchResults={5}
                        fullWidth={true}
                        onNewRequest={name => this.setState({ name })}
                        onUpdateInput={name => this.setState({ name })}
                    />
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collections: state.collections.list,
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
)(AdminAddCollectionDialog);
