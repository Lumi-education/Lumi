// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Dialog } from 'material-ui';

// container
import BottomNavigation from './bottom-navigation';
import CollectionSummary from './summary';

// local
import { IState } from 'client/state';

// types

// actions
import { push, right_drawer_open, set_appbar_title } from 'lib/ui/actions';

// modules
import * as Cards from 'lib/cards';
import * as Collections from 'lib/collections';

interface IStateProps {
    collection_id: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class UserCollectionFetch extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(
            Cards.actions.get_user_collection_data(this.props.collection_id)
        );

        this.props
            .dispatch(
                Collections.actions.get_collection(this.props.collection_id)
            )
            .then(res => {
                this.props.dispatch(
                    Cards.actions.get_cards(res.payload[0].cards)
                );
            });
    }

    public render() {
        return <div>{this.props.children}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_id: ownProps.params.collection_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserCollectionFetch
);
