// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import { Map } from 'immutable';
import * as debug from 'debug';
// components
import CollectionSettingsComponent from '../components/collection-settings';
// local
import { IState } from 'client/state';

// types
import { ICollection } from 'lib/collections/types';
import { ICard } from 'lib/cards/types';

// selectors
import { select_cards_as_map } from 'lib/cards/selectors';
import { select_collection_by_id } from 'lib/collections/selectors';

// actions
import {
    get_collection,
    update_collection,
    delete_collection
} from 'lib/collections/actions';

import { Dialog, RaisedButton } from 'material-ui';

const log_action = debug('lumi:actions:collection-settings');
const log_props = debug('lumi:props:collections:container:collection-settings');

interface IPassedProps {
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    collection: ICollection;
}

interface IDispatchProps {
    dispatch: (action) => any;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    show_delete_collection_dialog: boolean;
}

export class CollectionSettingsContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_delete_collection_dialog: false
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_collection(this.props.collection_id));
    }

    public componentWillReceiveProps(nextProps: IProps) {
        log_props('receiving new props', nextProps);
    }

    public render() {
        return (
            <div>
                <CollectionSettingsComponent
                    update={update =>
                        this.props.dispatch(
                            update_collection(this.props.collection_id, update)
                        )
                    }
                    delete={() =>
                        this.setState({ show_delete_collection_dialog: true })
                    }
                    cancel={() =>
                        this.props.dispatch(push('/admin/collections'))
                    }
                    collection={this.props.collection}
                />
                <Dialog
                    title={'Deleting collection ' + this.props.collection.name}
                    open={this.state.show_delete_collection_dialog}
                    actions={[
                        <RaisedButton
                            label="No"
                            onClick={() =>
                                this.setState({
                                    show_delete_collection_dialog: false
                                })
                            }
                        />,
                        <RaisedButton
                            label="Yes"
                            primary={true}
                            onClick={() => {
                                this.props
                                    .dispatch(
                                        delete_collection(
                                            this.props.collection_id
                                        )
                                    )
                                    .then(() => {
                                        log_action(
                                            'delete_collection -> promise resolved'
                                        );
                                        this.props.dispatch(
                                            push('/admin/collections')
                                        );
                                    });
                            }}
                        />
                    ]}
                    onRequestClose={() =>
                        this.setState({ show_delete_collection_dialog: false })
                    }
                >
                    Do you really want to delete the collection '{
                        this.props.collection.name
                    }'?
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_id: ownProps.collection_id,
        collection: select_collection_by_id(state, ownProps.collection_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action),
        push: (url: string) => dispatch(push(url))
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(CollectionSettingsContainer);
