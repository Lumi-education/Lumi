// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';

// components
import { Paper, Card, CardActions, CardHeader, CardText } from 'material-ui';

// modules
import * as Cards from 'lib/cards';

const log = debug('lumi:lib:cards:container:card-list');

interface IPassedProps {
    card_ids: string[];
}

interface IStateProps extends IPassedProps {
    cards: Cards.ICard[];
    selected_cards: string[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardsContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        log('componentWillMount');
        this.props.dispatch(
            Cards.actions.get_cards(
                this.props.card_ids[0] !== 'all'
                    ? this.props.card_ids
                    : undefined
            )
        );
    }

    public render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                {this.props.cards.map(card => (
                    <Paper
                        zDepth={3}
                        style={{
                            width: '320px',
                            height: '480px',
                            margin: '10px',
                            overflow: 'scroll'
                        }}
                    >
                        <Cards.CardViewContainer
                            card_id={card._id}
                            collection_id={''}
                        />
                    </Paper>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    return {
        cards:
            ownProps.card_ids[0] !== 'all'
                ? Cards.selectors.select_cards_by_ids(state, ownProps.card_ids)
                : Cards.selectors.select_all_cards(state),
        card_ids: ownProps.card_ids,
        selected_cards: state.cards.ui.selected_cards
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
)(CardsContainer);
