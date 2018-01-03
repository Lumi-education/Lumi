// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';

import { Avatar, Divider, List, ListItem } from 'material-ui';

// local
import { IState } from 'client/state';

// types
import { ICollection, collection_selectors, collection_actions } from '../';

interface IPassedProps {
    collection_ids: string[];
}

interface IStateProps extends IPassedProps {
    collections: ICollection[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionListContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(
            collection_actions.get_collections(this.props.collection_ids)
        );
    }

    public render() {
        const collections = this.props.collections;

        return (
            <List>
                {collections.length === 0 ? (
                    <ListItem primaryText="No collections found" />
                ) : null}
                {collections.map(collection => (
                    <div key={collection._id}>
                        <ListItem
                            leftAvatar={
                                <Avatar>
                                    {collection.name.substring(0, 3)}
                                </Avatar>
                            }
                            secondaryText={collection.description}
                            primaryText={collection.name}
                        />
                        <Divider inset={true} />
                    </div>
                ))}
            </List>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collections: collection_selectors.select_collections_by_ids(
            state,
            ownProps.collection_ids
        ),
        collection_ids: ownProps.collection_ids
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
)(CollectionListContainer);
