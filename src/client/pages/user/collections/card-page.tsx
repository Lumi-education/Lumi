// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { Dialog } from 'material-ui';

// container
import BottomNavigation from './bottom-navigation';

// local
import { IState } from 'client/state';

// types

// actions
import { push, right_drawer_open, set_appbar_title } from 'lib/ui/actions';

// modules
import * as Cards from 'lib/cards';
import * as Collections from 'lib/collections';
import * as Data from 'lib/data';

interface IStateProps {
    collection: Collections.ICollection;
    collection_id: string;
    card: Cards.ICard;
    card_id: string;
    right_appbar_icon: JSX.Element;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    show_collection_overview_dialog: boolean;
}

export class UserCollectionCard extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            show_collection_overview_dialog: false
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (this.props.card._id !== nextProps.card._id) {
            this.props.dispatch(set_appbar_title(nextProps.card.name));
        }
    }

    public componentWillMount() {
        this.props.dispatch(set_appbar_title(this.props.card.name));

        this.props.dispatch(
            Data.actions.get_user_collection_data(this.props.collection_id)
        );

        this.props
            .dispatch(
                Collections.actions.get_collection(this.props.collection_id)
            )
            .then(res => {
                this.props.dispatch(
                    Cards.actions.get_cards(this.props.collection.cards)
                );
            });
    }

    public render() {
        return (
            <div>
                <Cards.CardViewContainer
                    key={this.props.card_id}
                    card_id={this.props.card_id}
                    collection_id={this.props.collection_id}
                />
                <BottomNavigation
                    card_id={this.props.card_id}
                    collection_id={this.props.collection_id}
                    onOverviewClick={() =>
                        this.setState({ show_collection_overview_dialog: true })
                    }
                />
                <Dialog
                    autoScrollBodyContent={true}
                    open={this.state.show_collection_overview_dialog}
                    contentStyle={{ width: '100%' }}
                    onRequestClose={() =>
                        this.setState({
                            show_collection_overview_dialog: false
                        })
                    }
                >
                    <Collections.CollectionOverviewContainer
                        collection_id={this.props.collection_id}
                        onListClick={(id: string) =>
                            this.setState({
                                show_collection_overview_dialog: false
                            })
                        }
                    />
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection: Collections.selectors.select_collection_by_id(
            state,
            ownProps.params.collection_id
        ),
        collection_id: ownProps.params.collection_id,
        card: Cards.selectors.select_card(state, ownProps.params.card_id),
        card_id: ownProps.params.card_id,
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
