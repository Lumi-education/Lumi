// modules
import * as React from 'react';
import { connect } from 'react-redux';

// components
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

// container
import CardList from 'client/packages/cards/container/card-list';

// actions
import { toggle_cards_dialog, select_card } from 'client/packages/ui/actions';
import { add_cards_to_collection } from 'client/packages/collections/actions';

// local
import { IState } from 'client/state';

interface IPassedProps {
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    show_cards_dialog: boolean;
    selected_card_ids: string[];
}

interface IDispatchProps {
    dispatch: (action) => void;
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
                            this.props.dispatch(
                                add_cards_to_collection(
                                    this.props.collection_id,
                                    this.props.selected_card_ids
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
                        <CardList
                            selected_card_ids={this.props.selected_card_ids}
                            onClick={card_id =>
                                this.props.dispatch(select_card(card_id))
                            }
                        />
                    </div>
                    <div style={{ flex: 1 }}>CARD_PREVIEW</div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        show_cards_dialog: state.ui.show_cards_dialog,
        collection_id: ownProps.collection_id,
        selected_card_ids: state.ui.selected_card_ids
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
