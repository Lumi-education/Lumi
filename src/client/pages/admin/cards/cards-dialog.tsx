// modules
import * as React from 'react';
import { connect } from 'react-redux';

// components
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

// container
import CardList from 'lib/cards/container/card-list';

// actions
import { toggle_cards_dialog, select_card } from 'lib/ui/actions';
import { add_cards_to_collection } from 'lib/collections/actions';

// local
import { IState } from 'client/state';

// modules
import * as Cards from 'lib/cards';
import * as Tags from 'lib/tags';

interface IPassedProps {
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    show_cards_dialog: boolean;
    card_ids: string[];
    selected_card_ids: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IPassedProps, IDispatchProps {}

export class CardsDialog extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Dialog
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none'
                }}
                title="Cards"
                autoScrollBodyContent={true}
                open={this.props.show_cards_dialog}
                onRequestClose={() =>
                    this.props.dispatch(toggle_cards_dialog())
                }
                actions={[
                    <RaisedButton
                        primary={true}
                        onClick={() => {
                            this.props
                                .dispatch(
                                    add_cards_to_collection(
                                        this.props.collection_id,
                                        this.props.selected_card_ids
                                    )
                                )
                                .then(res =>
                                    this.props.dispatch(
                                        Cards.actions.reset_card_selection()
                                    )
                                );
                            this.props.dispatch(toggle_cards_dialog());
                        }}
                        label={
                            'Add (' + this.props.selected_card_ids.length + ')'
                        }
                    />
                ]}
            >
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        <Tags.TagsFilterContainer />

                        <CardList
                            card_ids={
                                this.props.card_ids.length === 0
                                    ? ['all']
                                    : this.props.card_ids
                            }
                            onClick={card_id =>
                                this.props.dispatch(
                                    Cards.actions.select_card(card_id)
                                )
                            }
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_ids: Tags.selectors.select_doc_ids_for_tags(
            state,
            state.tags.ui.selected_tags
        ),
        show_cards_dialog: state.ui.show_cards_dialog,
        collection_id: ownProps.collection_id,
        selected_card_ids: state.cards.ui.selected_cards
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(CardsDialog);
