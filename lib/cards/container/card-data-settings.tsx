// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';

// components
import { List, ListItem, Subheader, Checkbox, Slider } from 'material-ui';

// modules
import * as Cards from 'lib/cards';
import * as Core from 'lib/core';
import * as UI from 'lib/ui';

interface IPassedProps {
    collection_id: string;
    user_id: string;
    card_id: string;
}

interface IStateProps extends IPassedProps {
    card_data: Cards.ICardData;
    card: Cards.ICard;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    score: number;
}

export class CardDataSettingsContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            score: undefined
        };
    }

    public componentWillMount() {
        if (!this.props.card_data._id) {
            this.props.dispatch(
                Core.actions.get(
                    this.props.user_id +
                        '-' +
                        this.props.collection_id +
                        '-' +
                        this.props.card_id
                )
            );
        }
        if (!this.props.card._id) {
            this.props.dispatch(Cards.actions.get_card(this.props.card_id));
        }

        this.setState({
            score: this.props.card_data.score
        });
    }

    public render() {
        return (
            <List>
                <Subheader>Score</Subheader>
                <ListItem
                    primaryText={(this.state.score * 100).toFixed(0) + '%'}
                >
                    <Slider
                        value={this.state.score}
                        onChange={(e, v) => this.setState({ score: v })}
                    />
                </ListItem>
                <ListItem
                    primaryText="Save"
                    onClick={() =>
                        this.props.dispatch(
                            Cards.actions.update_data(
                                assign(
                                    this.props.card_data,
                                    { graded: true },
                                    this.state
                                )
                            )
                        )
                    }
                />
            </List>
        );
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    return {
        user_id: ownProps.user_id,
        collection_id: ownProps.collection_id,
        card_id: ownProps.card_id,
        card_data: Cards.selectors.select_data(
            state,
            ownProps.user_id,
            ownProps.collection_id,
            ownProps.card_id
        ),
        card: Cards.selectors.select_card(state, ownProps.card_id)
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
)(CardDataSettingsContainer);
