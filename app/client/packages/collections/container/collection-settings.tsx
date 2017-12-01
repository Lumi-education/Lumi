// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';
import * as debug from 'debug';
// components
import CollectionSettingsComponent from '../components/collection-settings';
// local
import { IState } from 'client/state';

// types
import { ICollection, ICard } from 'common/types';

// selectors
import { select_cards_as_map } from 'client/packages/cards/selectors';
import { select_collection_by_id } from 'client/packages/collections/selectors';

// actions
import {
    get_collection,
    update_collection,
    delete_collection
} from 'client/packages/collections/actions';

import { Dialog, RaisedButton } from 'material-ui';

const log = debug('lumi:collections:container:collection-settings');

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
        if (this.props.collection_id !== 'new') {
            this.props.dispatch(get_collection(this.props.collection_id));
        }
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
                    {...this.props}
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
                                        log('delete promise resolved');
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
// () => {
//     this.props
//         .dispatch(
//             delete_collection(this.props.collection_id)
//         )
//         .then(() => {
//             log('delete promise resolved');
//             this.props.dispatch(push('/admin/collections'));
//         });
// }
