// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

// components
import CollectionCardsAdminComponent from '../components/collection-cards-admin';

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
    update_collection
} from 'client/packages/collections/actions';

import { Dialog } from 'material-ui';

interface IPassedProps {
    collection_id: string;
}
interface IStateProps extends IPassedProps {
    collection: ICollection;
}

interface IDispatchProps {
    dispatch: (action) => void;
    push: (url: string) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    show_dialog: boolean;
}

export class CollectionSettingsContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_dialog: false
        };
    }

    public render() {
        return <div>{this.props.collection.name}</div>;
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
