import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import * as shortid from 'shortid';

import { IState } from 'client/state';

import { ICollection } from 'common/types';
import { IGroup } from 'client/packages/groups';

// selectors
import { select_group } from 'client/packages/groups/selectors';

// actions
import { get_collections } from 'client/packages/collections/actions';

import { add_collection_to_group } from 'client/packages/groups/actions';

interface IStateProps {
    collections: ICollection[];
    group: IGroup;
    group_id: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    name: string;
}

export class AdminAddCollectionDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: ''
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
        this.props.dispatch(
            push('/admin/groups/' + this.props.group_id + '/collections')
        );
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
            <Dialog
                title="Add Collection"
                actions={actions}
                modal={true}
                open={true}
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
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collections: state.collections.list,
        group: select_group(state, ownProps.params.group_id),
        group_id: ownProps.params.group_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminAddCollectionDialog
);
