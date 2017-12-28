// modules
import * as React from 'react';
import { connect } from 'react-redux';

import SVGLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import { AppBar, IconButton } from 'material-ui';

// container
import { CardViewContainer } from 'client/packages/cards';
import BottomNavigation from './bottom-navigation';

// local
import { IState } from 'client/state';

// types
import { ICollection } from 'common/types';
import { ICard } from 'client/packages/cards/types';

// selectors
import { select_card } from 'client/packages/cards/selectors';
import { select_collection_by_id } from 'client/packages/collections/selectors';
import { select_data, select_collection } from 'client/packages/data/selectors';

// actions
import { push, right_drawer_open } from 'client/packages/ui/actions';
import { get_collection } from 'client/packages/collections/actions';
import {
    create_data,
    update_data,
    get_data
} from 'client/packages/data/actions';

interface IStateProps {
    collection: ICollection;
    collection_id: string;
    card: ICard;
    data;
    collection_data;
    card_id: string;
    right_appbar_icon: JSX.Element;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
}

export class UserCollectionCard extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (this.props.card._id !== nextProps.card._id) {
            this.props.dispatch(
                get_data({
                    collection_id: nextProps.collection_id,
                    card_id: nextProps.card._id
                })
            );
        }
    }

    public componentWillMount() {
        this.props.dispatch(
            get_data({
                collection_id: this.props.collection_id,
                card_id: this.props.card._id
            })
        );
    }

    public render() {
        return (
            <div>
                <AppBar
                    style={{
                        background: 'linear-gradient(120deg, #3498db, #1abc9c)'
                    }}
                    showMenuIconButton={true}
                    title={this.props.card.name}
                    iconElementLeft={
                        <IconButton>
                            <SVGLeft />
                        </IconButton>
                    }
                    onLeftIconButtonTouchTap={() =>
                        this.props.dispatch(
                            push(
                                '/user/collections/' +
                                    this.props.collection_id +
                                    '/cards'
                            )
                        )
                    }
                    iconElementRight={this.props.right_appbar_icon}
                    onRightIconButtonTouchTap={() =>
                        this.props.dispatch(right_drawer_open())
                    }
                />
                <CardViewContainer
                    card_id={this.props.card_id}
                    collection_id={this.props.collection_id}
                />
                <BottomNavigation
                    card_id={this.props.card_id}
                    collection_id={this.props.collection_id}
                />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection: select_collection_by_id(
            state,
            ownProps.params.collection_id
        ),
        collection_id: ownProps.params.collection_id,
        card: select_card(state, ownProps.params.card_id),
        card_id: ownProps.params.card_id,
        collection_data: select_collection(
            state,
            ownProps.params.collection_id
        ),
        data: select_data(
            state,
            ownProps.params.collection_id,
            ownProps.params.card_id
        ),
        right_appbar_icon: state.ui.right_appbar_icon
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserCollectionCard
);
